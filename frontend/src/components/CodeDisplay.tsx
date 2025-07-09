import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import CodeEditorDisplay from "./CodeEditorDisplay";

type Props = {
  code: string;
  problem_name: string;
  language: string;
};

const CodeDisplay = ({ code, problem_name, language }: Props) => {
   
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] !max-w-[70vw] w-full bg-slate-900 border-slate-800 text-white pt-8">
        <DialogHeader className="border-b border-slate-800 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              
                <DialogTitle className="text-xl font-bold text-white">
                  Submitted Code for Problem - {problem_name}
                </DialogTitle>
                <div>
                  <Badge
                    className="bg-green-500/10 text-green-400 border-green-500/20 font-medium"
                  >
                    {language.toLowerCase()}
                  </Badge>
                </div>
            </div>
          </div>
        </DialogHeader>

        <CodeEditorDisplay code={code} language={language} />
        
      </DialogContent>
    </Dialog>
  );
};

export default CodeDisplay;
