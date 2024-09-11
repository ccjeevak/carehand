"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

const PassKeyModal = () => {
  const savedKey: string | null = window && window.localStorage.getItem('accessKey') || null;
  const [open, setOpen] = useState<boolean>(true);
  const[passkey, setPasskey] = useState<string>("");
  const[error, setError] = useState<string>("");
  const router = useRouter();
  
  useEffect(()=>{
    if(savedKey) {
        const decryptedKey = decryptKey(savedKey);
        if(decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            setOpen(false);
            router.push("/admin");
        }
    }
  },[savedKey]);

  const handleCloseModal = () => {
    setOpen(false);
    router.push("/");
  };

  const handleAction = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem('accessKey', encryptedKey);
        setOpen(false);
        router.push("/admin");

    } else {
        setError('Invalid passkey. Please try again.')
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between items-center">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="Close"
              width={20}
              height={20}
              onClick={() => handleCloseModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.....
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
            <InputOTPGroup className="flex justify-between w-full">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-14-regular mt-4 text-red-400 text-center">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAction} className="shad-primary-btn flex-1">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PassKeyModal;
