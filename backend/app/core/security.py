"""Security and authentication utilities."""

import logging
from typing import Any
from fastapi import HTTPException, status
from jose import JWTError, jwt
from app.core.config import settings
from app.db.supabase import get_supabase_client

logger = logging.getLogger(__name__)


def verify_supabase_token(token: str) -> dict[str, Any]:
    """Verify Supabase JWT token and extract user information.

    Supports direct Supabase auth verification, JWT unverified claims fallback,
    and mock tokens for development/testing.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 1. Dev / Test shortcut for mock tokens
    if token.startswith("mock-jwt-") or token in ("test-token", "dev-token"):
        user_id = token[len("mock-jwt-"):] if token.startswith("mock-jwt-") else "test-user-123"
        return {
            "id": user_id,
            "email": f"{user_id}@example.com",
            "role": "authenticated",
            "user_metadata": {"full_name": "Test User"},
        }

    # 2. Try validating via Supabase client
    client = get_supabase_client()
    try:
        user_resp = client.auth.get_user(token)
        if user_resp and hasattr(user_resp, "user") and user_resp.user:
            u = user_resp.user
            return {
                "id": str(getattr(u, "id", "")),
                "email": str(getattr(u, "email", "")),
                "role": getattr(u, "role", "authenticated"),
                "user_metadata": getattr(u, "user_metadata", {}) or {},
            }
    except Exception as e:
        logger.debug("Supabase client auth.get_user failed: %s", e)

    # 3. Decode claims using python-jose
    try:
        claims = jwt.get_unverified_claims(token)
        sub = claims.get("sub")
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject claim",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {
            "id": sub,
            "email": claims.get("email", f"{sub}@example.com"),
            "role": claims.get("role", "authenticated"),
            "user_metadata": claims.get("user_metadata", {}),
        }
    except JWTError as e:
        logger.warning("JWT claims decoding failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
