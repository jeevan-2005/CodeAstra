import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Brain, Copy } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Markdown from "react-markdown";
import { ScrollArea } from "./ui/scroll-area";

// onClose={() => setIsFullScreenOpen(false)}

type Props = {
  aiReview: string;
  aiFeature: string;
};

const AIReviewDialog = ({ aiReview, aiFeature }: Props) => {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiReview);
      // You can add a toast notification here
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Dialog defaultOpen>
      <DialogTrigger>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 bg-transparent cursor-pointer"
        >
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          Full Screen
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] !max-w-[70vw] w-full bg-slate-900 border-slate-800 text-white pt-8">
        <DialogHeader className="border-b border-slate-800 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  AI Code Analysis
                </DialogTitle>
                <p className="text-sm text-slate-400 capitalize mt-1">
                  {aiFeature.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                AI Powered
              </Badge>
              <Button
                onClick={handleCopyToClipboard}
                size="sm"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 bg-transparent cursor-pointer"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[70vh] w-[67vw] border border-slate-800 text-slate-300 rounded-sm">
          <div className="prose prose-invert p-5 whitespace-pre-wrap break-words w-[97%]">
            <Markdown>{aiReview.trim()}</Markdown>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AIReviewDialog;

