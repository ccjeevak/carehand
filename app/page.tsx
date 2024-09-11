import PatientForm from "@/components/forms/PatientForm";
import PassKeyModal from "@/components/PassKeyModal";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import Image from "next/image";

const DynamicNavigateToAdminPage = dynamic(()=> import('@/components/NavigateToAdminPage'),{
  ssr : false
})
export default function Home({searchParams:{admin}}:{searchParams:{admin:string}}) {
  const isAdmin = admin === 'true';
  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PassKeyModal />}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-10 w-fit mb-12"
          />
          <PatientForm />
          <div className="text-14-regular mt-20 flex justify-between items-center">
            <p className="text-dark-600">@ 2024 CarePulse Copyright</p>
            <DynamicNavigateToAdminPage />
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        alt="patient"
        width={1000}
        height={1000}
        className="max-w-[50%] side-img"
      />
    </div>
  );
}
