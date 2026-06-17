import Image from "next/image";
import { classNames } from "../utils";

export function MissionTypeIcon({ type }) {
  return (
    <span
      className={classNames(
        "inline-flex flex-none items-center justify-center text-[11px] text-zinc-100",
      )}
      aria-hidden="true"
    >
      {type === "research" && (
        <Image 
          src={"/Mission type(Research).svg"} 
          width={20} 
          height={20}
          alt="mission type research"
        />
      )}
      {type === "feature" && (
        <Image 
          src={"/Mission type(Feature).svg"} 
          width={20} 
          height={20}
          alt="mission type feature"
        />
      )}
      {type === "task" && (
        <Image 
          src={"/Mission type(Task).svg"} 
          width={20} 
          height={20}
          alt="mission type task"
        />
      )}
    </span>
  );
}

