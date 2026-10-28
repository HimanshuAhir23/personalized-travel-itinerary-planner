"""Export endpoints for PDF generation and printable HTML views."""

import html
import io
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, StreamingResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from app.api.deps import get_current_user, get_trip_service
from app.services.trips.trip_service import TripService

router = APIRouter(prefix="/trips/{trip_id}/export", tags=["Export"])


def _generate_pdf_bytes(trip: dict[str, Any], itinerary: dict[str, Any]) -> bytes:
    """Generate a formatted PDF document using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Title"],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#1E3A8A"),
        alignment=0,
        spaceAfter=6,
    )

    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=12,
    )

    day_header_style = ParagraphStyle(
        "DayHeader",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1D4ED8"),
        spaceBefore=12,
        spaceAfter=4,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1F2937"),
    )

    body_bold = ParagraphStyle(
        "BodyBold",
        parent=body_style,
        fontName="Helvetica-Bold",
    )

    story = []

    # Title & Subtitle
    destination = trip.get("destination", "Custom Travel Itinerary")
    story.append(Paragraph(f"WanderWise AI — {destination}", title_style))
    start_date = trip.get("start_date", "")
    end_date = trip.get("end_date", "")
    budget = trip.get("budget", 0)
    currency = trip.get("currency", "USD")
    travelers = trip.get("travelers", 1)
    pace = trip.get("travel_pace", "moderate")

    meta_text = (
        f"<b>Dates:</b> {start_date} to {end_date} | "
        f"<b>Travelers:</b> {travelers} | "
        f"<b>Budget:</b> {budget} {currency} | "
        f"<b>Pace:</b> {pace.title()}"
    )
    story.append(Paragraph(meta_text, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB"), spaceAfter=10))

    # Planning notes if any
    planning_notes = itinerary.get("planning_notes")
    if planning_notes:
        story.append(Paragraph(f"<b>Planning Advice:</b> {planning_notes}", body_style))
        story.append(Spacer(1, 10))

    # Days
    days = itinerary.get("days", [])
    for day in days:
        day_num = day.get("day_number", 1)
        date_str = day.get("date", "")
        summary = day.get("summary", "")
        story.append(Paragraph(f"Day {day_num} — {date_str}: {summary}", day_header_style))

        activities = day.get("activities", [])
        if activities:
            table_data = [
                [
                    Paragraph("Time", body_bold),
                    Paragraph("Activity & Location", body_bold),
                    Paragraph("Category", body_bold),
                    Paragraph("Est. Cost", body_bold),
                ]
            ]

            for act in activities:
                time_str = act.get("start_time", "09:00")
                dur = act.get("duration_minutes", 60)
                name = act.get("name", "")
                loc = act.get("location", "")
                cat = act.get("category", "").title()
                cost = act.get("estimated_cost", 0.0)
                curr = act.get("currency", currency)

                time_cell = Paragraph(f"<b>{time_str}</b><br/>({dur} min)", body_style)
                act_cell = Paragraph(f"<b>{name}</b><br/><font color='#6B7280'>{loc}</font>", body_style)
                cat_cell = Paragraph(cat, body_style)
                cost_cell = Paragraph(f"{cost:.2f} {curr}", body_style)

                table_data.append([time_cell, act_cell, cat_cell, cost_cell])

            col_widths = [1.0 * inch, 4.0 * inch, 1.2 * inch, 1.2 * inch]
            act_table = Table(table_data, colWidths=col_widths, repeatRows=1)
            act_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F3F4F6")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]))
            story.append(act_table)
        else:
            story.append(Paragraph("<i>No activities scheduled for this day.</i>", body_style))

        day_notes = day.get("notes")
        if day_notes:
            story.append(Spacer(1, 4))
            story.append(Paragraph(f"<b>Day Note:</b> {day_notes}", body_style))

        story.append(Spacer(1, 14))

    # Total cost footer
    total_cost = itinerary.get("total_estimated_cost", 0.0)
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB"), spaceAfter=8))
    footer_text = f"<b>Total Estimated Activity Cost:</b> {total_cost:.2f} {currency}"
    story.append(Paragraph(footer_text, day_header_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def _generate_print_html(trip: dict[str, Any], itinerary: dict[str, Any]) -> str:
    """Generate print-ready HTML page."""
    destination = html.escape(str(trip.get("destination", "")))
    start_date = html.escape(str(trip.get("start_date", "")))
    end_date = html.escape(str(trip.get("end_date", "")))
    travelers = html.escape(str(trip.get("travelers", 1)))
    budget = html.escape(str(trip.get("budget", 0)))
    currency = html.escape(str(trip.get("currency", "USD")))
    travel_pace = html.escape(str(trip.get("travel_pace", "moderate")).title())
    planning_notes = html.escape(str(itinerary.get("planning_notes", "")))
    total_cost = itinerary.get("total_estimated_cost", 0.0)

    days_html = ""
    for d in itinerary.get("days", []):
        day_num = d.get("day_number", 1)
        date_str = html.escape(str(d.get("date", "")))
        summary = html.escape(str(d.get("summary", "")))
        notes = html.escape(str(d.get("notes", "")))

        acts_html = ""
        for act in d.get("activities", []):
            time_str = html.escape(str(act.get("start_time", "")))
            dur = act.get("duration_minutes", 60)
            name = html.escape(str(act.get("name", "")))
            cat = html.escape(str(act.get("category", "")).title())
            loc = html.escape(str(act.get("location", "")))
            desc = html.escape(str(act.get("description", "")))
            cost = act.get("estimated_cost", 0.0)
            curr = html.escape(str(act.get("currency", currency)))
            travel_notes = html.escape(str(act.get("travel_notes", "")))

            acts_html += f"""
            <div class="activity-card">
              <div class="activity-time">{time_str} ({dur}m)</div>
              <div class="activity-details">
                <div class="activity-header">
                  <span class="activity-name">{name}</span>
                  <span class="activity-category">{cat}</span>
                  <span class="activity-cost">{cost:.2f} {curr}</span>
                </div>
                <div class="activity-location">{loc}</div>
                <div class="activity-description">{desc}</div>
                {f'<div class="activity-transit">Transit: {travel_notes}</div>' if travel_notes else ''}
              </div>
            </div>
            """

        days_html += f"""
        <div class="day-section">
          <div class="day-header">
            <h3>Day {day_num} — {date_str}</h3>
            <p class="day-summary">{summary}</p>
          </div>
          <div class="activities-container">
            {acts_html}
          </div>
          {f'<div class="day-notes"><strong>Note:</strong> {notes}</div>' if notes else ''}
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WanderWise AI - {destination} Itinerary</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      margin: 0;
      padding: 24px;
      background: #f9fafb;
    }}
    .container {{
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }}
    .header {{
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }}
    .header h1 {{
      margin: 0 0 8px 0;
      color: #1e3a8a;
      font-size: 28px;
    }}
    .meta-bar {{
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      color: #4b5563;
      font-size: 14px;
    }}
    .planning-notes {{
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 24px;
      font-size: 14px;
    }}
    .day-section {{
      margin-bottom: 32px;
      page-break-inside: avoid;
    }}
    .day-header {{
      background: #f3f4f6;
      padding: 10px 16px;
      border-radius: 6px;
      margin-bottom: 12px;
    }}
    .day-header h3 {{
      margin: 0;
      color: #1d4ed8;
      font-size: 18px;
    }}
    .day-summary {{
      margin: 4px 0 0 0;
      color: #4b5563;
      font-size: 14px;
    }}
    .activity-card {{
      display: flex;
      gap: 16px;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 0;
    }}
    .activity-time {{
      width: 100px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      flex-shrink: 0;
    }}
    .activity-details {{
      flex-grow: 1;
    }}
    .activity-header {{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }}
    .activity-name {{
      font-weight: 600;
      font-size: 15px;
      color: #111827;
    }}
    .activity-category {{
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }}
    .activity-cost {{
      margin-left: auto;
      font-weight: 600;
      color: #059669;
      font-size: 14px;
    }}
    .activity-location {{
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 4px;
    }}
    .activity-description {{
      font-size: 13px;
      color: #374151;
    }}
    .activity-transit {{
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
      font-style: italic;
    }}
    .day-notes {{
      margin-top: 8px;
      font-size: 13px;
      color: #4b5563;
      background: #fafafa;
      padding: 8px 12px;
      border-radius: 4px;
    }}
    .total-cost {{
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px solid #e5e7eb;
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      text-align: right;
    }}
    .print-button {{
      display: block;
      margin: 0 auto 20px auto;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }}
    @media print {{
      body {{
        background: #fff;
        padding: 0;
      }}
      .container {{
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }}
      .print-button {{
        display: none;
      }}
    }}
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">Print Itinerary</button>
  <div class="container">
    <div class="header">
      <h1>WanderWise AI — {destination}</h1>
      <div class="meta-bar">
        <span><strong>Dates:</strong> {start_date} to {end_date}</span>
        <span><strong>Travelers:</strong> {travelers}</span>
        <span><strong>Budget:</strong> {budget} {currency}</span>
        <span><strong>Pace:</strong> {travel_pace}</span>
      </div>
    </div>
    {f'<div class="planning-notes"><strong>Planning Advice:</strong> {planning_notes}</div>' if planning_notes else ''}
    {days_html}
    <div class="total-cost">
      Total Estimated Cost: {total_cost:.2f} {currency}
    </div>
  </div>
</body>
</html>
"""


@router.get("/pdf", summary="Export itinerary as a styled PDF")
async def export_pdf(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> StreamingResponse:
    """Generate and download a styled PDF of the trip itinerary."""
    trip = await trip_service.get_trip(trip_id=trip_id, user_id=current_user["id"])
    itinerary = await trip_service.get_itinerary(trip_id=trip_id, user_id=current_user["id"])

    pdf_bytes = _generate_pdf_bytes(trip, itinerary)
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="wanderwise-{trip_id}.pdf"',
        },
    )


@router.get("/print", response_class=HTMLResponse, summary="Get print-friendly HTML view")
async def export_print(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> HTMLResponse:
    """Render a clean, print-optimized HTML view of the itinerary."""
    trip = await trip_service.get_trip(trip_id=trip_id, user_id=current_user["id"])
    itinerary = await trip_service.get_itinerary(trip_id=trip_id, user_id=current_user["id"])

    html_content = _generate_print_html(trip, itinerary)
    return HTMLResponse(content=html_content)
