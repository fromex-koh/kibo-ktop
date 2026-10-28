// 목업 보고서 데이터를 JSON 으로 표준 출력에 쓴다 — build.mjs 가 묶어 실행해 HTML 의 데이터 칸(①)에 넣는다.
import {getInnovationGrowthReport} from '@/content/service/k-bigx-innovation-report'

const report = await getInnovationGrowthReport(undefined)
process.stdout.write(JSON.stringify(report, null, 2))
