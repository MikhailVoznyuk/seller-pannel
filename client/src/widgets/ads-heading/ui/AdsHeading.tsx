import styles from "@/widgets/ads-heading/ui/AdsHeading.module.css";


export function AdsHeading({total}: {total: number}) {
    return (
        <div className={styles.heading}>
            <div>
                <h1 className={styles.title}>Мои объявления</h1>
                <p className={styles.subtitle}>{total} объявлений</p>
            </div>
        </div>
    )
}