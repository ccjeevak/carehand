import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = async ({
  params: {userId},
  searchParams:{appointmentId}
}:{
  params: {userId: string}
  searchParams : {[key:string]: string}
}) => {
  const appointmentData = await getAppointment(appointmentId);
  const doctor = Doctors.find(doctor => doctor.name === appointmentData?.primaryPhysician)
  return (
    <div className="h-screen flex overflow-y-auto px-[5%] remove-scrollbar">
      <div className="m-auto flex  flex-col items-center justify-between gap-10 py-10">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="Logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header text-center max-w-[600px] mb-6">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>
        <section className="border-y-2 border-dark-400 w-full gap-8 md:w-fit py-8 flex flex-col md:flex-row items-center">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateTime(appointmentData?.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn" >
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright py-12">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default SuccessPage;
