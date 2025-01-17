"use client";

import cn from "mxcn";
import { EmailInput } from "./email-input";
import { DisplaySteps } from "./display-steps";
import { Welcome } from "./welcome";
import { UseCases } from "./use-cases";
import useLangbase from "@/hooks/use-langbase";
import { isEmptyObject } from "@/utils/is-object-empty";
import { Button } from "./ui/button";

export function AgentPage({ className }: React.ComponentProps<"div">) {
  const {
    inputEmail,
    setInputEmail,
    isLoading,
    completedSteps,
    emailReply,
    sendEmailToAgent,
    resetAgent,
  } = useLangbase();

  return (
    <div className="min-h-screen">
      <Welcome />
      <EmailInput
        email={inputEmail}
        setEmail={setInputEmail}
        isLoading={isLoading}
        sendEmailToAgent={sendEmailToAgent}
        resetAgent={resetAgent}
      />
      <div className={cn("pb-36 pt-4 md:pt-10", className)}>
        {!isLoading && isEmptyObject(completedSteps) && (
          <UseCases sendEmailToAgent={sendEmailToAgent} />
        )}
        {!isEmptyObject(completedSteps) && (
          <DisplaySteps
            email={inputEmail}
            completedSteps={completedSteps}
            emailReply={emailReply}
          />
        )}
      </div>
      {/* <div>
        <form
          action={async () => {
            const response = await fetch("/api/sentiment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: `Congratulations! You have been selected as the winner of a $100 million lottery!`,
              }),
            });
            const sentimentAnalysis = await response.json();

            return sentimentAnalysis;
          }}
        >
          <Button type="submit">Test Sentiment</Button>
        </form>
      </div> */}
    </div>
  );
}
