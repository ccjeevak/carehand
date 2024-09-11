import AppointmentForm from '@/components/forms/AppointmentForm'
import { getPatient } from '@/lib/actions/patient.actions';
import Image from 'next/image'
import React from 'react'

const NewAppointmentPage = async ({params:{userId}}: SearchParamProps) => {
    const patient = await getPatient(userId);
  return (
    <div className='flex h-screen'>
        <section className='container remove-scrollbar'>
        <div className="sub-container max-w-[860px] py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-10 w-fit mb-12"
          />

          <AppointmentForm  type='create' userId={userId} patientId={patient?.$id}/>

          <p className="copyright py-12">© 2024 CarePluse</p>
          </div>
        </section>
        <Image
        src="/assets/images/appointment-img.png"
        width={1000}
        height={1000}
        alt="careHand"
        className="max-w-[390px] side-img bg-bottom"
      />
    </div>
  )
}

export default NewAppointmentPage