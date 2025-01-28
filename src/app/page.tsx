import Header from "@/components/custom/header";
import Hero from "@/components/custom/hero";

import { getCurrentUser } from "@/lib/auth";

async function Homepage() {
  const user = await getCurrentUser();
  const isAuthenticated = user !== undefined;

  return (
    <div>
      <Header />
      <Hero userCookie={user} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default Homepage;
