"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const [authorized, setAuthorized] = useState(false);

   useEffect(() => {
      const user = localStorage.getItem("vivoUser");
      if (!user) {
         router.replace("/login");
      } else {
         setAuthorized(true);
      }
   }, []);

   if (!authorized) return null; 

   return <>{children}</>;
}
