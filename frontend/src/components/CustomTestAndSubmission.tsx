import React from "react";
import { Button } from "./ui/button";
import { FaPlay } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const CustomTestAndSubmission = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="verdict">Verdict</TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <textarea
              className="w-full h-[100px] border-3 rounded-sm p-2"
              placeholder="custom input"
            />
          </TabsContent>
          <TabsContent value="output">
            <div className="w-full min-h-[100px] max-h-[200px] border-3 rounded-sm p-2"></div>
          </TabsContent>
          <TabsContent value="verdict">
            <div className="w-full min-h-[100px] max-h-[200px] border-3 rounded-sm p-2"></div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <Button className="w-[200px] text-[15px] cursor-pointer">
          Run <FaPlay />{" "}
        </Button>
        <Button
          className="w-[200px] text-[15px] cursor-pointer"
          variant="destructive"
        >
          Submit <FaCircleCheck />
        </Button>
      </div>
    </div>
  );
};

export default CustomTestAndSubmission;
