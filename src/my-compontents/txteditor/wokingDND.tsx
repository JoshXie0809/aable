import React, { useEffect, useState } from 'react';
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Text,
} from '@fluentui/react-components';

import MonacoEditorBox from './MonacoEditorBox';


const useStyles = makeStyles({
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  dialog: {
    position: 'absolute',
    width: '800px',
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow64,
    borderRadius: tokens.borderRadiusXLarge,
    zIndex: 11,
    ...shorthands.padding('0px'),
    overflow: 'hidden',
  },
  header: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('16px', '24px'),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: tokens.borderRadiusXLarge,
    borderTopRightRadius: tokens.borderRadiusXLarge,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  body: {
    ...shorthands.padding('24px'),
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    lineHeight: '20px',
  },
  footer: {
    ...shorthands.padding('16px', '24px'),
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'right',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
  },
  closeButton: {
    minWidth: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    fontSize: '16px',
    lineHeight: '1',
    border: 'none',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
});

export default function FluentUIDialogApp() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2,
    });
  }, [open]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition((prev) => {
      const nextX = prev.x + delta.x;
      const nextY = prev.y + delta.y;

      const maxX = window.innerWidth ;
      const maxY = window.innerHeight;

      return {
        x: Math.max(0, Math.min(nextX, maxX)),
        y: Math.max(0, Math.min(nextY, maxY)),
      };
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Button onClick={() => setOpen(true)}>打開 Fluent UI Style Dialog</Button>
      {open && (
        <>
          <Backdrop />
          <FluentDialog position={position} onClose={() => setOpen(false)} />
        </>
      )}
    </DndContext>
  );
}

function Backdrop() {
  const styles = useStyles();
  return <div className={styles.backdrop} />;
}

function FluentDialog({
  position,
  onClose,
}: {
  position: { x: number; y: number };
  onClose: () => void;
}) {

  const styles = useStyles();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'fluent-dialog',
  });

  const finalX = (transform?.x ?? 0) + position.x;
  const finalY = (transform?.y ?? 0) + position.y;

  const dialogStyle: React.CSSProperties = {
    position: 'fixed',
    transform: `translate(${finalX}px, ${finalY}px)`,
  };

  const [editorValue, setEditorValue] = useState("");

  return (
    <div ref={setNodeRef} className={styles.dialog} style={dialogStyle}>
      <div className={styles.header} {...listeners} {...attributes}>
        <Text className={styles.title}>設定</Text>
      </div>

      <div className={styles.body}>
        <Text>
          這是模仿 Fluent UI 樣式的自製 Dialog。你可以拖曳上方標題區塊、關閉對話框，並保留 Fluent UI 的 spacing、字體、顏色與邊界風格。
        </Text>

        {/* <MonacoEditorBox value={editorValue} onChange={(nv) => setEditorValue(nv)} /> */}
      </div>

      <div className={styles.footer}>
        <Button appearance="secondary" onClick={onClose}>
          關閉
        </Button>
      </div>
    </div>
  );
}
