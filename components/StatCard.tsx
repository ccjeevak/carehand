import clsx from "clsx";
import Image from "next/image";
import React from "react";
type StateCardProps = {
  count: number;
  label: string;
  icon: string;
  type: "appointments" | "pending" | "cancelled";
};
const StatCard = ({ count = 0, label, icon, type }: StateCardProps) => {
  return (
    <div
      className={clsx("flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-6 shadow-lg", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex gap-4 items-center">
        <Image src={icon} height={32} width={32} alt={label}   className="size-8 w-fit" />
        <h2 className="text-32-bold text-white"> {count}</h2>
      </div>
      <p className="text-14-regular">{`Total number of ${label.toLowerCase()}`}</p>
    </div>
  );
};

export default StatCard;
