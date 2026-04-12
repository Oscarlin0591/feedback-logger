import { useState, useEffect, type ReactNode } from "react"
import { Card, CardBody, CardImg, CardText, CardTitle } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import styles from './WeekCard.module.css';

type WeekCardProps = {
    weekTitle: string;
    children: ReactNode; //Allows all WeekCards to have as many or as few lessons as desired
}
export function WeekCard({weekTitle, children}: WeekCardProps) {
    const navigate = useNavigate();

    return (
        <Card className={styles.Card}>
            <div className={styles.bigText}>{weekTitle}</div>
            <hr></hr>
            {children}
        </Card>
    )
}