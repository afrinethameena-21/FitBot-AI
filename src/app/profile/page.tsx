"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-background px-4 pt-20">
      {/* Profile Card */}
      <div className="bg-card/90 backdrop-blur-sm border-2 border-[#BF00FF] rounded-xl shadow-lg p-6 w-full max-w-md flex items-center gap-6">
        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#BF00FF] relative">
          <Image
            src={user?.imageUrl || "https://via.placeholder.com/120"}
            alt="User Avatar"
            fill
            className="object-cover"
            sizes="96px"
            priority
          />
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {user?.firstName} {user?.lastName}
          </h2>
        </div>
      </div>

      {/* Quote */}
      <p
        className="mt-8 text-center italic font-semibold text-lg max-w-xl px-4 leading-relaxed"
        style={{ color: "#BF00FF" }}
      >
        &quot;Fitness is not about being better than someone else. It&apos;s about
        being better than you used to be.&quot;
      </p>
    </section>
  );
};

export default ProfilePage;
