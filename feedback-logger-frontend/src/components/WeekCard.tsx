import type { ReactNode } from "react"
import { Card } from "react-bootstrap"
import styles from './WeekCard.module.css';

type WeekCardProps = {
    weekTitle: string;
    children: ReactNode; //Allows all WeekCards to have as many or as few lessons as desired
}
export function WeekCard({weekTitle, children}: WeekCardProps) {

    return (
        <Card className={styles.Card}>
            <div className={styles.bigText}>{weekTitle}</div>
            <hr></hr>
            {children}
        </Card>
    )
}