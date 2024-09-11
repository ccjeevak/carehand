import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  return (
    <div className="h-screen flex">
      <section className="container remove-scrollbar">
        <div className="sub-container max-w-[860px] py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="h-10 w-fit mb-12"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        width={1000}
        height={1000}
        alt="careHand"
        className="max-w-[390px] side-img"
      />
    </div>
  );
};

export default Register;
