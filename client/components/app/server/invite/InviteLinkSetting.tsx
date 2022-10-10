import { Button, ModalCancelButton, ModalFormFooter, Select } from "@app/common";
import { SelectOption } from "@app/common/select/Select";
import { useChannel } from "@lib/contexts/ChannelContext";
import { useTab } from "@lib/contexts/TabContext";
import { useAppDispatch } from "@lib/hooks/redux";
import { ServerService } from "@lib/services/server.service";
import { updateServer } from "@lib/store/slices/servers.slice";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InviteFormTab } from "./InviteForm";

const expireOptions: SelectOption[] = [
  { label: "30 minutes", value: 1800 },
  { label: "1 hour", value: 3600 },
  { label: "6 hours", value: 21600 },
  { label: "12 hours", value: 43200 },
  { label: "1 day", value: 86400 },
  { label: "7 days", value: 604800 },
  { label: "Never", value: 0 },
];

const maxUsesOptions: SelectOption[] = [
  { label: "No limit", value: 0 },
  { label: "1 use", value: 1 },
  { label: "5 uses", value: 5 },
  { label: "10 uses", value: 10 },
  { label: "25 uses", value: 25 },
  { label: "50 uses", value: 50 },
  { label: "100 uses", value: 100 },
];

const InviteLinkSetting = () => {
  const { server } = useChannel();
  const dispatch = useAppDispatch();
  const { setTab } = useTab<InviteFormTab>();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    maxAge: number;
    maxUses: number;
  }>({
    defaultValues: {
      maxAge: 604800,
      maxUses: 0,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!server) return;
    try {
      const invite = (await ServerService.createInvite(server.id, data.maxAge, data.maxUses)).data;

      setTab("view");
      dispatch(
        updateServer({
          id: server.id,
          currentInviteCode: invite.code,
        })
      );
    } catch (e: any) {
      console.log(e?.response?.message || e);
    }
  });

  return (
    <div>
      <div className="p-4">
        <h1 className="text-header-primary font-semibold text-[17px] my-2">
          Server invite link settings
        </h1>
      </div>
      <div className="px-4 py-2">
        <div className="text-[13px] font-semibold text-header-secondary mb-2">EXPIRE AFTER</div>
        <div className="mb-4">
          <Controller
            name="maxAge"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select onChange={onChange} options={expireOptions} defaultValue={value} />
            )}
          />
        </div>
        <div className="text-[13px] font-semibold text-header-secondary mb-2">
          MAX NUMBER OF USES
        </div>
        <div className="mb-4">
          <Controller
            name="maxUses"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select onChange={onChange} options={maxUsesOptions} defaultValue={value} />
            )}
          />
        </div>
      </div>
      <ModalFormFooter>
        <ModalCancelButton
          close={false}
          onClick={() => {
            setTab("view");
          }}
        />
        <Button onClick={onSubmit} loading={isSubmitting} grow size="medium">
          Generate a New Link
        </Button>
      </ModalFormFooter>
    </div>
  );
};

export default InviteLinkSetting;
