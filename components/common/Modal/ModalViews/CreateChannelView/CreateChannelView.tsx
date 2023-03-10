import { FC, useState } from "react";
import s from "./CreateChannelView.module.scss";
import { ModalCtaButton } from "@components/common";
import cn from "classnames";
import { useNetworkClient } from "contexts/network-client-context";
import { useUI } from "contexts/ui-context";

const CreateChannelView: FC<{}> = ({}) => {
  const { createChannel } = useNetworkClient();
  const { closeModal } = useUI();
  const [channelName, setChannelName] = useState<string>("");
  const [channelDesc, setChannelDesc] = useState<string>("");
  const [error, setError] = useState("");
  return (
    <div
      className={cn("w-full flex flex-col justify-center items-center", s.root)}
    >
      <h2 className="mt-9 mb-4">Create new Channel</h2>
      <input
        type="text"
        placeholder="Channel name"
        value={channelName}
        onChange={e => {
          setChannelName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Channel description"
        className="mt-4"
        value={channelDesc}
        onChange={e => {
          setChannelDesc(e.target.value);
        }}
      />
      {error && (
        <div className={"text text--xs mt-2"} style={{ color: "var(--red)" }}>
          {error}
        </div>
      )}
      <ModalCtaButton
        buttonCopy="Create"
        cssClass="mt-5 mb-8"
        onClick={() => {
          createChannel(channelName, channelDesc)
            .then(() => {
              setChannelName("");
              setChannelDesc("");
              closeModal();
            })
            .catch((error: any) => {
              setError("Something wrong happened, please check your details.");
            });
        }}
      />
    </div>
  );
};

export default CreateChannelView;
