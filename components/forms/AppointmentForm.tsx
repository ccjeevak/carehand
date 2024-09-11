"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

interface AppointmentFormProps {
  userId: string;
  type: "create" | "cancel" | "schedule";
  patientId: string;
  appointment?:Appointment,
  setOpen: (open:boolean) => void
}
const AppointmentForm = ({ userId, type, patientId, appointment, setOpen }: AppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  const route = useRouter()
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician,
      schedule: new Date(appointment?.schedule || Date.now()),
      reason: appointment?.reason || "",
      note: appointment?.note ||  "",
      cancellationReason: appointment?.cancellationReason || ""
    },
  });
  const submitLabel: {[key: string]: string} = {
    create: "Create Appointment",
    cancel: "Cancel Appointment",
    schedule: "Schedule Appiontment"
  };

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status = "pending";
    switch (type) {
      case "cancel":
        status = "cancelled";
        break;
      case "schedule":
        status = "scheduled";
        break;
    }
    try {
      if(type === 'create' && patientId) {
        const appointmentData = {
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          cancellationReason: values.cancellationReason,
          note: values.note,
          reason: values.reason as string,
          userId,
          patient: patientId,
          status: status as Status
        };
        const appointment = await createAppointment(appointmentData);
        if(appointment) {
          form.reset();
          route.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id as string,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status,
            cancellationReason: values.cancellationReason || ""
          },
          type
        };
        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if(updatedAppointment) {
          form.reset();
          setOpen(false);
        }
      }
    }catch(error) {
      console.error("Appointment API failed", error)
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
       { type === 'create' &&  (<section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>) }
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      height={24}
                      width={24}
                      alt={doctor.name}
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for appointment"
                placeholder="ex: Annual montly check-up"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Additional comments/notes"
                placeholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - hh:mm aa"
              placeholder={new Date().toLocaleDateString()}
            />
          </>
        )}
        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="ex: Urgent meeting came up"
          />
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {submitLabel[type]}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
