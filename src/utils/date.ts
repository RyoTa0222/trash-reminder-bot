import {DateTime} from "luxon"

// 第２金曜日と第四金曜日を取得する

// 日付に関するクラス
class DateJP {
    // 今日の日付データ
    today: DateTime
    // 月初めの日付データ
    startAtMonth: DateTime
    constructor () {
        this.today = DateTime.now().setZone("Asia/Tokyo")
        this.startAtMonth = DateTime.now().setZone("Asia/Tokyo").startOf('month')
    }
    // 今日の日付データ取得
    getToday() {
        return this.today
    }
    // 月の初めの日付データ取得
    getStartAtMonth () {
        return this.startAtMonth
    }
    // 第２金曜日の日付データの取得
    getSecondFriday () {
        const FRIDAY_NUMBER = 5
        // 月の初めの曜日を数値で取得（１→月曜）
        const numOfDayOfWeek = Number(this.startAtMonth.toFormat('c'))
        // 差分を計算
        const diff = (numOfDayOfWeek <= FRIDAY_NUMBER) ? FRIDAY_NUMBER - numOfDayOfWeek : 7 - numOfDayOfWeek + FRIDAY_NUMBER
        return this.startAtMonth.plus({day: diff}).plus({week: 1})
    }
    // 第４金曜日の日付データの取得
    getFourthFriday () {
        const FRIDAY_NUMBER = 5
        // 月の初めの曜日を数値で取得（１→月曜）
        const numOfDayOfWeek = Number(this.startAtMonth.toFormat('c'))
        // 差分を計算
        const diff = (numOfDayOfWeek <= FRIDAY_NUMBER) ? FRIDAY_NUMBER - numOfDayOfWeek : 7 - numOfDayOfWeek + FRIDAY_NUMBER
        return this.startAtMonth.plus({day: diff}).plus({week: 3})
    }
    // 今日より後で第２・第４金曜日はマッチするか確認して、マッチした場合その日付データを取得
    getMatchedDateAfterToday () {
        // 第２金曜日にマッチするか確認
        const secondFriday = this.getSecondFriday()
        if (secondFriday > this.today) {
            return secondFriday
        }
        // 第２金曜日にマッチしなかった場合は第４金曜日を確認
        const fourthFriday = this.getFourthFriday()
        if (fourthFriday > this.today) {
            return fourthFriday
        }
        // 何もマッチしない場合はnullを返す
        return null
    }
}

export default DateJP
