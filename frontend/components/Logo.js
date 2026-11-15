import Image from "next/image";

export default function Logo({ tamanho = 32 }) {
  return (
    <Image
      src="/iron_logo.png"
      alt=""
      width={30}
      height={30}
      style={{ width: tamanho, height: "auto" }}
      priority
    />
  );
}