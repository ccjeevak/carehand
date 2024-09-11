"use client";
import { PatientFormValidation, userFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form, FormControl } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
     ...PatientFormDefaultValues
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    try {
        setLoading(true);
        let formData;
        const {identificationDocument = []} = values;
        if(identificationDocument.length > 0) {
            const file = identificationDocument[0];
            const blobFile  = new Blob([file],{
                type: file.type
            })
            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', file.name);
        }
        try {
            const patientFormData = {
                ...values,
                userid: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            };
            //@ts-check
            const patient = await registerPatient(patientFormData);
            if(patient) router.push(`/patients/${user.$id}/new-appointment`);
        }catch(error) {
            console.log("Registertation Form save", error); 
        }
    } catch(error) {
        console.log("Registertation Form ", error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Personal Information</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            placeholder="John Elix"
            iconSrc="/assets/icons/user.svg"
            iconAlt="User"
          />
          <div className="grid xl:grid-cols-2 gap-6 grid-cols-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="John Elix"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="grid xl:grid-cols-2 gap-6 grid-cols-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of birth"
              placeholder="Select your birth date"
              iconSrc="/assets/icons/calendar.svg"
              iconAlt="Date of birth"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field: any) => {
                return (
                  <FormControl>
                    <RadioGroup
                      className="flex gap-6  h-11"
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      {GenderOptions.map((option) => (
                        <div className="radio-group" key={option}>
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </div>
          <div className="grid xl:grid-cols-2 gap-6 grid-cols-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address"
              placeholder="ex: 14 street,New York, NY-5001"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </div>
          <div className="grid xl:grid-cols-2 gap-6 grid-cols-1">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency contact name"
              placeholder="Gurdian's name"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency Contact number"
              placeholder="ex: (555) 123-4567"
            />
          </div>
        </section>
        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Medical Information</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary physician"
            placeholder="Select a physician"
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
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="ex: BlueCross"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ex: ABCXXXXX1234"
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="ex: Peanuts, Penicillin, Pollen"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current medications"
              placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family medical history (if relevant)"
              placeholder="ex: Mother had breast cancer"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="ex: Asthma diagnosis in childhood"
            />
          </div>
        </section>
        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex: 123456789"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field: any) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          ></CustomFormField>
        </section>
        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>
        <SubmitButton isLoading={isLoading}>Submit and continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
