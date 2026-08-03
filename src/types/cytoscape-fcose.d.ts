// cytoscape-fcose 패키지의 TypeScript 타입 보완 선언.
// Cytoscape 그래프에 fCoSE(force-directed Compound Spring Embedder) 레이아웃 플러그인을 등록할 때 사용하며,
// network-graph.tsx와 company-relationship-graph.tsx에서 동적 import 후 cytoscape.use(fcose)로 연결한다.
declare module 'cytoscape-fcose' {
    import type cytoscape from 'cytoscape'

    const fcose: cytoscape.Ext
    export default fcose
}
