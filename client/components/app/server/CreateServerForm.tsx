import { Button, Input, ModalFormContainer, ModalFormContent } from "@app/common";
import ModalCloseButton from "@app/common/modal/ModalCloseButton";
import { useModal } from "@app/common/modal/ModalContext";
import ModalFormFooter from "@app/common/modal/modal_form/ModalFormFooter";
import { ServerService } from "@lib/services/server.service";
import imageCompression from "browser-image-compression";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { AiFillCamera } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";

const CreateServerForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<{
    name: string;
    icon: string | null;
  }>();

  const { close } = useModal();
  const icon = watch("icon");
  const onSubmit = handleSubmit(async ({ icon, name }) => {
    try {
      await ServerService.createServer(name, icon);
      close();
    } catch (e: any) {
      console.log(e?.response);
    }
  });

  const serverName = watch("name");

  return (
    <ModalFormContainer theme="light">
      <ModalFormContent>
        <ModalCloseButton />
        <div className="text-center">
          <h1 className="text-header-primary font-black text-2xl my-2">Create your server</h1>
          <div className="text-header-secondary px-4">
            Give your new servers a personality with a name and an icon. You can always change it
            later.
          </div>
        </div>
        <div className="flex-center select-none">
          <div className=" w-24 h-24 p-1 relative">
            {icon ? (
              <div
                style={{
                  backgroundImage: `url(${icon.toString()})`,
                  backgroundSize: "100% 100%",
                }}
                className="w-full h-full bg-center rounded-full bg-no-repeat"
              />
            ) : (
              <div className="w-full h-full border-dashed rounded-full border-2  border-header-secondary flex-center flex-col">
                <div>
                  <AiFillCamera size={28} />
                </div>
                <div className="text-xs font-bold">UPLOAD</div>
                <div className="absolute top-0 right-0 bg-primary text-white rounded-full p-1">
                  <BsPlus size={20} />
                </div>
                {icon && <img src={icon.toString()} alt="Icon" />}
              </div>
            )}
            <input
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  if (!e.target.files[0].name.match(/.(gif)$/i)) {
                    const file = e.target.files[0];
                    const compressedFile = await imageCompression(file, {
                      maxSizeMB: 1,
                      maxWidthOrHeight: 512,
                    });

                    setValue("icon", await imageCompression.getDataUrlFromFile(compressedFile));
                  } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(e.target.files[0]);
                    reader.onload = function () {
                      setValue("icon", reader.result?.toString() ?? null);
                    };
                  }
                  e.target.value = "";
                }
              }}
              type="file"
            />
          </div>
        </div>
        <div className="my-2">
          <Input label="Server Name" {...register("name")} />
        </div>
      </ModalFormContent>
      <ModalFormFooter>
        <Button
          onClick={onSubmit}
          disabled={_.isEmpty(serverName)}
          loading={isSubmitting}
          size="medium"
          className="p-4"
        >
          Create
        </Button>
      </ModalFormFooter>
    </ModalFormContainer>
  );
};

export default CreateServerForm;
