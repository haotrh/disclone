import { Button } from "@app/common/button";
import { useAppSelector } from "@hooks/redux";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface LayerModalNoticeChangesProps {
  defaultValues?: any;
  onSubmit: () => any;
}

const LayerModalNoticeChanges = ({
  defaultValues,
  onSubmit,
}: LayerModalNoticeChangesProps) => {
  const {
    reset,
    formState: { isSubmitting, isDirty },
  } = useFormContext();

  const settings = useAppSelector((state) => state.me.settings);

  const onReset = () => {
    reset(defaultValues);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="absolute px-5 pb-5 bottom-0 max-w-[740px] w-full"
        >
          <div
            className={classNames(
              "w-full flex py-2 px-2.5 rounded-md items-center shadow-xl",
              {
                "bg-white/60": settings?.theme === "light",
                "bg-neutral-900/75": settings?.theme !== "light",
              }
            )}
          >
            <div className="flex-1 pl-1 text-header-primary font-medium">
              Careful — you have unsaved changes!
            </div>
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={onReset}
                className="p-2 hover:underline mr-4 text-header-primary font-medium text-sm"
              >
                Reset
              </button>
              <Button
                size="small"
                onClick={onSubmit}
                loading={isSubmitting}
                grow
                theme="success"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(LayerModalNoticeChanges);
