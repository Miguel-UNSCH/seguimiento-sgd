import { auth } from "@/auth";
import DocumentTrackingPage from "@/components/views/document-tracking-page/DocumentTrackingPage";

async function Page() {

  const session = await auth();

  if (!session) {
    return <p>Cargando ...</p>;
  }

  return (
    <>
      <DocumentTrackingPage session={session}/>
    </>
  )
}

export default Page;
