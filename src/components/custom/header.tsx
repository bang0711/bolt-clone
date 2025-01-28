import { cookies } from "next/headers";
import Link from "next/link";

import { LogoutButton, LoginButton } from "../auth";

async function Header() {
  const user = (await cookies()).get("user");

  const isAuthenticated = user !== undefined;
  return (
    <div className="flex items-center justify-between p-4">
      <Link href={"/"}>
        <h1 className="text-4xl font-bold">Bolt</h1>
      </Link>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </div>
  );
}

export default Header;
