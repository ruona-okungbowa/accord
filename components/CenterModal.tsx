import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface Props {
  children: any;
  isOpen: boolean;
  onClose: () => void;
  width: number | string;
  padding?: string;
  borderRadius?: string;
  background?: string;
}

const CenterModal = ({
  children,
  isOpen,
  onClose,
  width,
  padding,
  borderRadius,
  background,
}: Props) => {
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: background || "#fff",
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "0",
            width: width,
            boxShadow: 24,
            maxHeight: "94%",
            borderRadius: borderRadius,
            p: padding || 2,
          }}
          className="overflow-y-scroll scrollbar"
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
};

export default CenterModal;
