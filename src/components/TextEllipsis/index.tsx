import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface TextEllipsisProps {
  children: ReactNode;
}

export function TextEllipsis({ children }: TextEllipsisProps) {
  return <p className={styles.textEllipsis}>{children}</p>;
}
