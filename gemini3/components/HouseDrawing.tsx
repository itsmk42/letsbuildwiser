/**
 * Section drawing of the house used as the pinned scrolltelling background.
 * Every <g data-s="n"> belongs to story step n; Story.tsx reveals children
 * marked .d (stroke draw-on) and .f (fade) as the reader scrolls.
 */
export default function HouseDrawing() {
  return (
      <svg id="house" aria-hidden viewBox="0 0 640 560" preserveAspectRatio="xMidYMid meet">
        <g className="lines">
          {/* wall body (appears with step 4, sits under the lines) */}
          <g data-s="4" stroke="none">
            <rect className="f" x="168" y="196" width="304" height="200" fill="rgba(255,255,255,.055)" />
            <rect className="f" x="400" y="146" width="56" height="42" fill="rgba(255,255,255,.055)" />
          </g>
          {/* 0 · the plot */}
          <g data-s="0">
            <path className="d" strokeWidth="2.6" d="M20 410H620" />
            <path className="d" strokeWidth="1.4" d="M36 410l-10 12M60 410l-10 12M84 410l-10 12M108 410l-10 12M132 410l-10 12M156 410l-10 12M204 410l-10 12M228 410l-10 12M252 410l-10 12M276 410l-10 12M300 410l-10 12M348 410l-10 12M372 410l-10 12M396 410l-10 12M420 410l-10 12M444 410l-10 12M492 410l-10 12M516 410l-10 12M540 410l-10 12M564 410l-10 12M588 410l-10 12M612 410l-10 12" />
            <path className="d" d="M80 410V384l14 5-14 5" />
            <path className="d" d="M560 410V384l-14 5 14 5" />
          </g>
          {/* 1 · structure */}
          <g data-s="1">
            <path className="d" d="M150 458H210V446L188 434H172L150 446Z" />
            <path className="d" d="M290 458H350V446L328 434H312L290 446Z" />
            <path className="d" d="M430 458H490V446L468 434H452L430 446Z" />
            <path className="d" d="M174 434V196M186 434V196" />
            <path className="d" d="M314 434V196M326 434V196" />
            <path className="d" d="M454 434V196M466 434V196" />
            <path className="d" d="M186 396H314M326 396H454" />
            <path className="d" d="M186 296H314M326 296H454M186 309H314M326 309H454" />
            <path className="d" d="M174 196H466M186 209H314M326 209H454" />
          </g>
          {/* 2 · slabs + dimensions */}
          <g data-s="2">
            <path className="d" d="M168 296V288H510V296H466" />
            <path className="d" d="M160 196V188H480V196H466M160 196H174" />
            <path className="d" d="M168 396V390H472V396" />
            <path className="d" strokeWidth="1.5" d="M80 500H560M80 492V508M560 492V508M74 506l12-12M554 506l12-12" />
            <path className="f" strokeWidth="1.2" strokeDasharray="3 5" d="M80 418V490M560 418V490" />
            <path className="d" strokeWidth="1.5" d="M50 410V188M42 410H58M42 296H58M42 188H58" />
          </g>
          {/* 3 · compliance */}
          <g data-s="3">
            <path className="f" strokeWidth="1.5" strokeDasharray="10 5 2 5" d="M80 124V380M560 124V380" />
            <path className="f" strokeWidth="1.5" strokeDasharray="6 6" d="M130 124V408M520 124V408" />
            <path className="f" strokeWidth="1.5" strokeDasharray="6 6" d="M60 112H600" />
            <path className="d" strokeWidth="1.5" d="M85 140H125M90 136l-5 4 5 4M120 136l5 4-5 4" />
            <path className="d" strokeWidth="1.5" d="M525 140H555M530 136l-5 4 5 4M550 136l5 4-5 4" />
          </g>
          {/* 4 · walls, openings, programme */}
          <g data-s="4">
            <path className="d" d="M168 390V296M168 288V196M472 390V296M472 288V196" />
            <path className="d" d="M222 390V320H262V390" />
            <path className="d" d="M356 334H424V372H356ZM390 334V372" />
            <path className="d" d="M216 228H284V268H216ZM250 228V268" />
            <path className="d" d="M372 288V216H412V288M392 216V288" />
            <path className="d" d="M400 188V146H456V188" />
            <path className="d" strokeWidth="1.6" d="M160 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M200 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M240 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M280 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M320 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M360 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M400 36h32v16h-32z" /><path className="d" strokeWidth="1.6" d="M440 36h32v16h-32z" />
            <g stroke="none" fill="var(--accent)"><rect className="f" x="164" y="40" width="24" height="8" /><rect className="f" x="204" y="40" width="24" height="8" /><rect className="f" x="244" y="40" width="24" height="8" /><rect className="f" x="284" y="40" width="24" height="8" /><rect className="f" x="324" y="40" width="24" height="8" /><rect className="f" x="364" y="40" width="24" height="8" /><rect className="f" x="404" y="40" width="24" height="8" /><rect className="f" x="444" y="40" width="24" height="8" /></g>
          </g>
          {/* 5 · finishes */}
          <g data-s="5">
            <path className="d" d="M160 188V170H480V188" />
            <path className="d" d="M472 262H510V288M484 262V288M497 262V288" />
            <path className="d" strokeWidth="1.6" d="M228 328H256V384H228Z" />
            <path className="d" d="M350 372H430M210 268H290" />
            <path className="d" d="M350 328H430M210 222H290M366 210H418" />
            <path className="d" d="M212 396H272M206 403H278" />
          </g>
          {/* 6 · sustainable */}
          <g data-s="6">
            <path className="f ns" stroke="none" fill="rgba(255,198,26,.16)" d="M196 170L210 146H250L236 170ZM248 170L262 146H302L288 170ZM300 170L314 146H354L340 170Z" />
            <path className="d" d="M196 170L210 146H250L236 170M223 170L237 146M203 158H243" />
            <path className="d" d="M248 170L262 146H302L288 170M275 170L289 146M255 158H295" />
            <path className="d" d="M300 170L314 146H354L340 170M327 170L341 146M307 158H347" />
            <path className="f ns" stroke="none" fill="rgba(255,198,26,.16)" d="M104 356C78 358 70 334 84 322C78 300 104 290 116 303C136 297 143 322 130 334C138 350 119 361 104 356Z" />
            <path className="d" d="M104 410V356M104 380l-10-10M104 372l9-9" />
            <path className="d" d="M104 356C78 358 70 334 84 322C78 300 104 290 116 303C136 297 143 322 130 334C138 350 119 361 104 356Z" />
            <path className="d" d="M164 196V368H148V378" />
            <path className="d" d="M136 378H160V410H136ZM136 390H160" />
            <circle className="f" cx="78" cy="62" r="15" fill="rgba(255,198,26,.22)" stroke="none" />
            <path className="d" d="M78 36V30M78 88V94M52 62H46M104 62H110M60 44l-4-4M96 44l4-4M60 80l-4 4M96 80l4 4" />
          </g>
        </g>

        {/* labels, stamp, badges */}
        <g data-s="1">
          <path className="f lead" d="M460 460V467" fill="none" strokeWidth="1.2" />
          <text className="f" x="460" y="478" textAnchor="middle">FOOTING</text>
        </g>
        <g data-s="2">
          <rect className="f" x="292" y="490" width="56" height="20" fill="#0A0A0A" />
          <text className="f" x="320" y="504" textAnchor="middle">30 FT</text>
          <text className="f" x="34" y="358" textAnchor="middle">GF</text>
          <text className="f" x="34" y="248" textAnchor="middle">FF</text>
          <g transform="translate(40 436)"><g className="f pop">
            <path d="M0 0H42L58 14L42 28H0Z" fill="var(--accent)" stroke="none" />
            <circle cx="45" cy="14" r="3" fill="#0A0A0A" />
            <text x="12" y="19.5" className="rupee">₹</text>
          </g></g>
          <text className="f" x="40" y="482">MATERIAL, OPTIMISED</text>
        </g>
        <g data-s="3">
          <text className="f" x="600" y="104" textAnchor="end">HEIGHT LIMIT</text>
          <text className="f" x="74" y="143.5" textAnchor="end">SETBACK</text>
          <g className="stamp" transform="translate(566 248) rotate(-14)"><g className="f pop">
            <circle r="37" fill="rgba(10,10,10,.85)" stroke="var(--accent)" strokeWidth="2" />
            <circle r="30" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 4" />
            <text y="-9" textAnchor="middle" style={{ fontSize: 8 }}>PLAN</text>
            <text y="5" textAnchor="middle">APPROVED</text>
            <path d="M-8 15l5 5 10-11" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g></g>
        </g>
        <g data-s="4">
          <text className="f" x="160" y="28">PROGRAMME</text>
          <text className="f" x="472" y="28" textAnchor="end">HANDOVER ✓</text>
        </g>
        <g data-s="5">
          <g transform="translate(350 440)"><g className="f pop"><circle r="10" fill="var(--accent)" /><path d="M-4.5 0l3 3.5 6-7" fill="none" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g></g>
          <g transform="translate(250 292)"><g className="f pop"><circle r="10" fill="var(--accent)" /><path d="M-4.5 0l3 3.5 6-7" fill="none" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g></g>
          <g transform="translate(424 334)"><g className="f pop"><circle r="10" fill="var(--accent)" /><path d="M-4.5 0l3 3.5 6-7" fill="none" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g></g>
          <g transform="translate(480 170)"><g className="f pop"><circle r="10" fill="var(--accent)" /><path d="M-4.5 0l3 3.5 6-7" fill="none" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></g></g>
          <text className="f" x="320" y="478" textAnchor="middle">CHECKED</text>
        </g>
        <g data-s="6">
          <text className="f" x="275" y="136" textAnchor="middle">SOLAR</text>
        </g>
      </svg>
  );
}
