"use client";
import RpcForm from "@/components/RpcForm";
export default function Appeal({ id }: { id: string }) {
  return <RpcForm fn="submit_appeal" hidden={{ p_case: id }} button="Submit appeal" fields={[{ name: "p_grounds", label: "Why do you want this decision reviewed?", type: "textarea", required: true }]} />;
}
