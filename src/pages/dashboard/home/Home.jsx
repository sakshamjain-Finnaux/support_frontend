import React from "react";
import useAuth from "../../../contexts/AuthContext";
import { Calendar } from "lucide-react";
function Home() {
  const { user } = useAuth();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Determine greeting based on time of day
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-400 mb-2">
        <Calendar className="w-4 h-4" />
        <span>{currentDate}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        {getGreeting()},{" "}
        <span className="capitalize text-primary-500 dark:text-primary-400">
          {user.first_name}!
        </span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        Welcome back to your support dashboard. Here's what's happening with
        your team today.
      </p>

      <div className="justify-center text-sm text-muted-foreground flex h-full items-end pt-4">
        <p>
          Need help? Check out our{" "}
          <a
            href="#"
            className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary/60 font-medium"
          >
            documentation
          </a>{" "}
          or contact support.
        </p>
      </div>
    </div>
  );
}

export default Home;
