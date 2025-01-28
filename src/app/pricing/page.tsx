import Header from "@/components/custom/header";
import PricingModel from "@/components/custom/pricing-model";

import { PRICING_DESC } from "@/data/lookup";

import { getCurrentUser } from "@/lib/auth";

async function PricingPage() {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <Header />
      <div className="mt-10 flex flex-col items-center p-10 md:px-32 lg:px-48">
        <h2 className="text-3xl font-bold">Pricing</h2>
        <p className="mt-4 max-w-xl text-center text-primary/50">
          {PRICING_DESC}
        </p>

        <div className="mt-7 flex w-full items-center justify-between rounded-xl border bg-secondary p-5">
          <h2>
            <span className="text-lg">{currentUser?.token} Tokens Left</span>
          </h2>

          <div className="">
            <h2 className="font-medium">Need more tokens?</h2>
            <p>Upgrade your plan below</p>
          </div>
        </div>

        <PricingModel user={currentUser} />
      </div>
    </div>
  );
}

export default PricingPage;
