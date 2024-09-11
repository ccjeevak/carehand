"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import Image from "next/image";
import { Doctors, StatusIcon } from "@/constants";
import { Appointment } from "@/types/appwrite.types";
import { formatDateTime } from "@/lib/utils";
import AppointmentModal from "../AppointmentModal";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({
      row: {
        original: { patient },
      },
    }) => {
      const randomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`;
        return randomColor;
      };
      return (
        <div className="flex gap-2 items-center">
          <div
            className="rounded-full border-none text-dark-300 text-[10px] font-medium size-8 flex items-center justify-center"
            style={{
              backgroundColor: randomColor(),
            }}
          >
            {patient.name
              .match(/(^\S\S?|\s\S)?/g)
              .map((v: string) => v.trim())
              .join("")
              .match(/(^\S|\S$)?/g)
              .join("")
              .toLocaleUpperCase()}
          </div>
          <p className="text-14-medium whitespace-nowrap">{patient.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({
      row: {
        original: { status },
      },
    }) => {
      return (
        <div
          className={clsx("status-badge min-w-[110px]", {
            "bg-green-600": status === "scheduled",
            "bg-blue-600": status === "pending",
            "bg-red-600": status === "cancelled",
          })}
        >
          <Image
            src={StatusIcon[status]}
            alt={StatusIcon[status]}
            width={24}
            height={24}
            className="w-3 h-fit"
          />
          <p
            className={clsx("test-12-semibold capitalize", {
              "text-green-500": status === "scheduled",
              "text-blue-500": status === "pending",
              "text-red-500": status === "cancelled",
            })}
          >
            {status}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({
      row: {
        original: { schedule },
      },
    }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({
      row: {
        original: { primaryPhysician },
      },
    }) => {
      const doctor = Doctors.find((doc) => doc.name === primaryPhysician);
      if (!doctor)
        return <div className="text-right font-medium">Not Assigned</div>;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="text-14-regular whitespace-nowrap">{doctor.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original } }) => {
      const {
        patient: { $id, userId },
      } = original;
      return (
        <div className="flex items-center gap-2">
          <AppointmentModal
            type="schedule"
            patientId={$id}
            userId={userId}
            appointment={original}
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            type="cancel"
            patientId={$id}
            userId={userId}
            appointment={original}
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
