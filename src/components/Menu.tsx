import styled from "@emotion/styled";
import { CSSProperties, FC, ReactNode, useCallback } from "react";

interface IProps {
  children?: ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: { stopPropagation: () => void }) => void;
  closeButton?: boolean;
}

export const Menu: FC<IProps> = ({
  children,
  style,
  show,
  onCloseModal,
  closeButton,
}) => {
  const stopPropagetion = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <StyledUserMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagetion}>
        {closeButton && (
          <StyledCloseButton onClick={onCloseModal}>&times;</StyledCloseButton>
        )}
        {children}
      </div>
    </StyledUserMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export const StyledUserMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  & > div {
    position: absolute;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
    border-radius: 6px;
    user-select: none;
    min-width: 360px;
    z-index: 512;
    max-height: calc(100vh - 20px);
    color: rgb(29, 28, 29);
  }
`;

export const StyledCloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;
