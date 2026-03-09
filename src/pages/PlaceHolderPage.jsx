const PlaceholderPage = ({ title, icon }) => (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"50vh",gap:14,textAlign:"center" }}>
    <div style={{ width:56,height:56,borderRadius:16,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",color:"#94a3b8" }}>{icon}</div>
    <div>
      <p style={{ fontSize:16,fontWeight:600,color:"#94a3b8",margin:0 }}>{title}</p>
      <p style={{ fontSize:13,color:"#cbd5e1",marginTop:4 }}>This section is coming soon.</p>
    </div>
  </div>
);

export default PlaceholderPage;
