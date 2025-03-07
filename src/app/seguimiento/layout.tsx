import { auth } from "@/auth";
import Header from "@/components/layout/Header";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="h-screen flex flex-col bg-background relative">
      <Header session={session}/>
      {children}
    </div>
  );
}