import { notFound } from 'next/navigation';

async function getReport(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fulcrum-reports.vercel.app';
    const res = await fetch(`${baseUrl}/api/generate-report?slug=${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function ReportPage({ params }: any) {
  const data = await getReport(params.slug);
  if (!data) return notFound();

  const ragColor = (rag: string) => ({ green: '#2d6a4f', yellow: '#b07d10', red: '#9b2c2c' }[rag] || '#000');
  const ragBg = (rag: string) => ({ green: '#edf5f0', yellow: '#fdf7e8', red: '#fdf0f0' }[rag] || '#fff');
  const ragBorder = (rag: string) => ({ green: 'rgba(45,106,79,0.2)', yellow: 'rgba(176,125,16,0.2)', red: 'rgba(155,44,44,0.2)' }[rag] || '#ccc');
  const initials = (name: string) => name?.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() || 'FC';
  const bgColors = ['#4a6fa5', '#6b8f71', '#8b6f47', '#5b7a8a', '#7a5b8a'];
  const companyBg = bgColors[(data.company_name?.length || 0) % bgColors.length];

  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <title>{`Job Ad Review — ${data.company_name} | Fulcrum`}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --orange:#ed732e;--orange-lt:#fdf0e6;--orange-md:#f6ca9e;
            --cream:#f8f2e9;--white:#ffffff;--dark:#170b01;--mid:#5a4030;
            --light:#9b8878;--border:#e8e0d4;--border-lt:#f0ece6;
            --green:#2d6a4f;--green-lt:#edf5f0;--amber:#b07d10;
            --amber-lt:#fdf7e8;--red:#9b2c2c;--red-lt:#fdf0f0;
            --serif:'Playfair Display',Georgia,serif;
            --sans:'DM Sans',system-ui,sans-serif;
          }
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:var(--sans);background:var(--white);color:var(--dark);}
          .wrap{max-width:860px;margin:0 auto;padding:0 56px;}
          @media(max-width:700px){
            .wrap{padding:0 24px;}
            .grid-2{grid-template-columns:1fr!important;}
            .grid-3{grid-template-columns:1fr!important;}
            .rec-grid{grid-template-columns:1fr!important;}
          }
        `}</style>
      </head>

      {/* HEADER */}
      <header style={{position:'sticky',top:0,zIndex:10,background:'#fff',borderBottom:'1px solid #e8e0d4',padding:'20px 56px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontFamily:'var(--serif)',fontSize:22,fontWeight:400,color:'#170b01'}}>fulcrum</span>
        <span style={{fontSize:11,fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',color:'#9b8878'}}>Job Ad Review</span>
      </header>

      {/* INTRO BOX */}
      <div style={{background:'#e8f4fb',borderBottom:'1px solid #c2dff0',padding:'22px 56px'}}>
        <div style={{maxWidth:860,margin:'0 auto',display:'flex',gap:16,alignItems:'flex-start'}}>
          <div style={{width:38,height:38,borderRadius:'50%',background:'#ed732e',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>
            We have spent years inside companies solving hiring problems. We write job ads constantly for our partners — and we know what lands with candidates and what does not. We came across yours and thought it was worth a look. No agenda, just a genuine review.
          </p>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:'#f8f2e9',padding:'60px 56px 52px',borderBottom:'3px solid #ed732e'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <div style={{width:44,height:44,borderRadius:8,background:companyBg,color:'#fff',fontSize:16,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {initials(data.company_name)}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:300,color:'#5a4030'}}>{data.company_name}</div>
              <div style={{fontSize:12,fontWeight:300,color:'#9b8878'}}>{data.role_title}</div>
            </div>
          </div>
          <p style={{fontSize:11,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:14}}>Your Job Ad Review</p>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:400,lineHeight:1.2,maxWidth:620,color:'#170b01',marginBottom:16}}>
            {data.hero_summary?.includes('.') ? (
              <>
                {data.hero_summary.split('.')[0]}.{' '}
                <em style={{fontStyle:'italic',color:'#ed732e'}}>{data.hero_summary.split('.').slice(1).join('.').trim()}</em>
              </>
            ) : data.hero_summary}
          </h1>
        </div>
      </div>

      {/* SCORE BAR */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e0d4',padding:'16px 56px'}}>
        <div style={{maxWidth:860,margin:'0 auto',display:'flex',flexWrap:'wrap',gap:20,alignItems:'center'}}>
          <span style={{fontSize:11,fontWeight:500,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9b8878',marginRight:8}}>OVERALL</span>
          {[{l:'Green',k:'green',c:'#2d6a4f'},{l:'Yellow',k:'yellow',c:'#b07d10'},{l:'Red',k:'red',c:'#9b2c2c'}].map(({l,k,c})=>(
            <div key={k} style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:c}}/>
              <span style={{fontSize:13,color:'#5a4030'}}>{l}</span>
              <span style={{fontSize:18,fontWeight:600,color:'#170b01'}}>{data.score_counts?.[k]||0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT YOU GOT RIGHT */}
      {data.got_right?.length > 0 && (
        <div style={{padding:'52px 0',borderBottom:'1px solid #e8e0d4'}}>
          <div className="wrap">
            <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Strengths</p>
            <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:12,color:'#170b01'}}>What you got right</h2>
            <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:600,marginBottom:32,lineHeight:1.7}}>These sections are working. They give candidates what they need to make a decision.</p>
            <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              {data.got_right.map((item: any, i: number) => (
                <div key={i} style={{background:'#edf5f0',border:'1px solid rgba(45,106,79,0.18)',borderRadius:8,padding:22}}>
                  <p style={{fontSize:13,fontWeight:600,color:'#2d6a4f',marginBottom:8}}>✓ {item.title}</p>
                  <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCORECARD */}
      <div style={{padding:'52px 0',borderBottom:'1px solid #e8e0d4'}}>
        <div className="wrap">
          <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Assessment</p>
          <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:12,color:'#170b01'}}>12-section scorecard</h2>
          <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:600,marginBottom:32,lineHeight:1.7}}>Each section scored against the Fulcrum framework. Red means candidates are not getting what they need. Yellow means it is there but needs more work.</p>
          <table style={{width:'100%',borderCollapse:'collapse',border:'1px solid #e8e0d4',borderRadius:8,overflow:'hidden',fontSize:13}}>
            <thead>
              <tr style={{background:'#f8f2e9'}}>
                {['Section','Status','Note'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',letterSpacing:1,borderBottom:'1px solid #e8e0d4',color:'#9b8878',fontWeight:500}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.sections?.map((s: any, i: number) => (
                <tr key={i} style={{borderBottom:'1px solid #e8e0d4'}}>
                  <td style={{padding:'12px 16px',fontWeight:500,color:'#170b01'}}>{s.name}</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background:ragBg(s.rag),color:ragColor(s.rag),border:`1px solid ${ragBorder(s.rag)}`,padding:'3px 9px',borderRadius:4,fontSize:11,fontWeight:600,textTransform:'uppercase',display:'inline-flex',alignItems:'center',gap:4}}>
                      <span style={{width:5,height:5,borderRadius:'50%',background:ragColor(s.rag),display:'inline-block'}}/>
                      {s.rag}
                    </span>
                  </td>
                  <td style={{padding:'12px 16px',fontWeight:300,color:'#5a4030',lineHeight:1.6}}>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP RECOMMENDATIONS */}
      <div style={{padding:'52px 0',borderBottom:'1px solid #e8e0d4'}}>
        <div className="wrap">
          <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Priority Fixes</p>
          <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:12,color:'#170b01'}}>The three things to fix first</h2>
          <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:600,marginBottom:40,lineHeight:1.7}}>Ordered by impact. These changes will most meaningfully improve the quality of applications you receive.</p>
          {data.top_recommendations?.map((rec: any, i: number) => (
            <div key={i} style={{marginBottom:48,paddingBottom:48,borderBottom:i<2?'1px solid #e8e0d4':'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:'#ed732e',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}}>{rec.rank||i+1}</div>
                <h3 style={{fontFamily:'var(--serif)',fontSize:19,fontWeight:400,margin:0,color:'#170b01'}}>{rec.title||rec.section}</h3>
              </div>
              <p style={{fontSize:14,fontWeight:300,color:'#5a4030',marginBottom:20,marginLeft:38,lineHeight:1.7,maxWidth:600}}>{rec.why}</p>
              <div className="rec-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginLeft:38}}>
                <div style={{background:'#fdf0f0',border:'1px solid rgba(155,44,44,0.14)',borderRadius:6,padding:16}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'#9b2c2c',marginBottom:8,letterSpacing:1}}>Before</p>
                  <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>{rec.before}</p>
                </div>
                <div style={{background:'#edf5f0',border:'1px solid rgba(45,106,79,0.14)',borderRadius:6,padding:16}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'#2d6a4f',marginBottom:8,letterSpacing:1}}>After</p>
                  <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>{rec.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK WINS */}
      {data.quick_wins?.length > 0 && (
        <div style={{padding:'52px 0',borderBottom:'1px solid #e8e0d4'}}>
          <div className="wrap">
            <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Quick Wins</p>
            <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:12,color:'#170b01'}}>Fast fixes that cost nothing</h2>
            <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:600,marginBottom:32,lineHeight:1.7}}>These can be changed in under ten minutes with no additional information needed.</p>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
              {data.quick_wins.map((win: any, i: number) => (
                <div key={i} style={{background:'#fdf0e6',border:'1px solid #f6ca9e',borderRadius:8,padding:20}}>
                  <p style={{fontSize:13,fontWeight:600,color:'#170b01',marginBottom:8}}>{win.title}</p>
                  <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>{win.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULCRUM RECOMMENDS */}
      <div style={{background:'#f8f2e9',padding:'52px 0'}}>
        <div className="wrap">
          <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Fulcrum Recommends</p>
          <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:12,color:'#170b01'}}>Two things that cost nothing and make a real difference.</h2>
          <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:600,marginBottom:32,lineHeight:1.7}}>These are not gaps in your ad. They are additions we recommend to every partner because we have seen the difference they make.</p>
          {[
            {
              title:'The inclusive application note',
              body:'Research shows that strong candidates self-select out when they do not meet every criterion. Adding one sentence below your requirements list meaningfully improves the breadth of applications you receive without changing who you are looking for.',
              quote:"Research shows that while men apply to jobs when they meet an average of 60% of the criteria, women and other folks in minority groups tend to only apply when they check every box. So if you think you have what it takes, but don't necessarily meet every single point above, please still get in touch. We'd love to have a chat and see if you could be a great fit.",
              footer:'We have included this in the rewrite below. Feel free to adapt the wording to suit your voice. The principle matters more than the exact phrasing.'
            },
            {
              title:'A note from the hiring manager',
              body:'The entire ad is written about the role. No one at your company signs it. Two or three sentences from the hiring manager in their own voice changes the tone of the entire ad and signals how your company treats people.',
              quote:`Hi, I'm [Name], I lead [function] at ${data.company_name}. I'm looking for someone who [specific quality]. If that sounds like you, I'd love to hear from you.`,
              footer:'We have included a draft version in the rewrite below. The hiring manager can adapt it or rewrite it entirely. The structure is the prompt.'
            }
          ].map((box,i)=>(
            <div key={i} style={{background:'#fff',border:'1px solid #e8e0d4',borderLeft:'3px solid #ed732e',borderRadius:6,padding:'24px 26px',marginBottom:20}}>
              <p style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',color:'#ed732e',marginBottom:8}}>Fulcrum Recommends</p>
              <h3 style={{fontFamily:'var(--serif)',fontSize:19,fontWeight:400,color:'#170b01',marginBottom:12}}>{box.title}</h3>
              <p style={{fontSize:14,fontWeight:300,color:'#5a4030',lineHeight:1.8,maxWidth:600,marginBottom:16}}>{box.body}</p>
              <div style={{borderLeft:'2px solid #e8e0d4',paddingLeft:16,margin:'16px 0',fontSize:14,fontStyle:'italic',color:'#5a4030',lineHeight:1.8}}>{box.quote}</div>
              <p style={{fontSize:13,fontWeight:300,color:'#9b8878'}}>{box.footer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FULL REWRITE */}
      <div style={{background:'#f8f2e9',borderTop:'3px solid #ed732e',padding:'52px 56px'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#ed732e',marginBottom:8}}>Full Rewrite</p>
          <h2 style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:400,marginBottom:24,color:'#170b01'}}>What the full rewrite could look like</h2>
          <div style={{background:'#fff',border:'1px solid #e8e0d4',borderLeft:'3px solid #ed732e',borderRadius:6,padding:'16px 18px',marginBottom:24}}>
            <p style={{fontSize:13,fontWeight:300,color:'#5a4030'}}>When we write job ads for our partners, we start with a full brief. We do not have that here. What follows is built from what your ad tells us. Treat it as a structural guide, not finished copy. You know your business better than we do.</p>
          </div>
          <div style={{background:'#fff',border:'1px solid #e8e0d4',borderRadius:8,padding:'32px 36px'}}>
            <p style={{fontSize:14,fontWeight:300,color:'#5a4030',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{data.full_rewrite}</p>
          </div>
        </div>
      </div>

      {/* LANGUAGE NOTE */}
      {data.language_note && (
        <div style={{padding:'0 56px 40px'}}>
          <div style={{maxWidth:860,margin:'0 auto'}}>
            <div style={{background:'#fdf7e8',border:'1px solid rgba(176,125,16,0.2)',borderLeft:'3px solid #b07d10',borderRadius:6,padding:'18px 20px',display:'flex',gap:12,alignItems:'flex-start'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b07d10" strokeWidth="2" style={{flexShrink:0,marginTop:2}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <p style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',color:'#b07d10',marginBottom:6}}>A note on language</p>
                <p style={{fontSize:13,fontWeight:300,color:'#5a4030',lineHeight:1.65}}>{data.language_note}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{background:'#e8f4fb',borderTop:'1px solid #e8e0d4',padding:'52px 56px',textAlign:'center'}}>
        <div style={{maxWidth:860,margin:'0 auto'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:22,fontWeight:400,marginBottom:16,color:'#170b01'}}>We help ambitious Australian companies hire better.</h2>
          <p style={{fontSize:14,fontWeight:300,color:'#5a4030',maxWidth:540,margin:'0 auto 24px',lineHeight:1.7}}>Fulcrum is an embedded talent partner, not a recruitment agency. We work inside your team on a subscription model — handling everything from job ads to hiring strategy. If this review was useful, let us have a conversation about what else we can help you solve.</p>
          <a href="https://wearefulcrum.com/contact/" style={{background:'#ed732e',color:'#fff',padding:'12px 28px',borderRadius:6,textDecoration:'none',fontSize:14,fontWeight:500,display:'inline-block'}}>Talk to Fulcrum</a>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{background:'#170b01',padding:'28px 56px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
        <span style={{fontFamily:'var(--serif)',fontSize:18,fontWeight:400,color:'#fff'}}>fulcrum</span>
        <span style={{fontSize:11,color:'rgba(248,242,233,0.4)'}}>Prepared by Fulcrum. wearefulcrum.com</span>
      </div>
    </>
  );
}