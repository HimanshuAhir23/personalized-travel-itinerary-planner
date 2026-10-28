import React, { useState } from 'react';
import { Copy, Check, Globe, Share2, Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  destination: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  tripId,
  destination,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/${tripId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Itinerary for ${destination} - WanderWise AI`,
          text: `Check out our day-by-day travel plan for ${destination}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Travel Itinerary"
      description={`Invite friends and travel companions to view your ${destination} blueprint.`}
      maxWidth="md"
    >
      <div className="space-y-6 pt-2">
        {/* Link Copy Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Shareable Public Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-700 font-mono focus:outline-none"
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Social & Channel Quick Links */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Send Directly Via
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out our ${destination} travel itinerary: ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl border border-gray-200 hover:bg-[#E8F0E4] hover:border-[#87A96B] flex flex-col items-center justify-center gap-1.5 transition-colors text-[#2D5016]"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-700">WhatsApp</span>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(`Travel Itinerary for ${destination}`)}&body=${encodeURIComponent(`Hey! Take a look at our trip plan: ${shareUrl}`)}`}
              className="p-3 rounded-2xl border border-gray-200 hover:bg-[#E8F0E4] hover:border-[#87A96B] flex flex-col items-center justify-center gap-1.5 transition-colors text-[#2D5016]"
            >
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700">Email</span>
            </a>

            {typeof navigator.share === 'function' ? (
              <button
                type="button"
                onClick={handleWebShare}
                className="p-3 rounded-2xl border border-gray-200 hover:bg-[#E8F0E4] hover:border-[#87A96B] flex flex-col items-center justify-center gap-1.5 transition-colors text-[#2D5016] cursor-pointer"
              >
                <Share2 className="w-5 h-5 text-[#D4A017]" />
                <span className="text-xs font-semibold text-gray-700">More Apps</span>
              </button>
            ) : (
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Planning our trip to ${destination} with @WanderWiseAI! ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl border border-gray-200 hover:bg-[#E8F0E4] hover:border-[#87A96B] flex flex-col items-center justify-center gap-1.5 transition-colors text-[#2D5016]"
              >
                <ExternalLink className="w-5 h-5 text-sky-500" />
                <span className="text-xs font-semibold text-gray-700">X (Twitter)</span>
              </a>
            )}
          </div>
        </div>

        {/* Public Access Badge */}
        <div className="p-3.5 rounded-2xl bg-[#FFF8DC]/80 border border-[#87A96B]/20 flex items-center gap-2.5 text-xs text-gray-700">
          <Globe className="w-4 h-4 text-[#2D5016] shrink-0" />
          <span>Anyone with this link can view this itinerary without an account.</span>
        </div>
      </div>
    </Modal>
  );
};
