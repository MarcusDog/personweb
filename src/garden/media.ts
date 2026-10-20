const labels:Record<string,string>={screenshot:'真实项目界面',design:'设计稿',concept:'概念素材',generated:'生成氛围素材',illustration:'生成插画',upload:'上传素材'}
export const sourceLabel=(type?:string)=>labels[type||'upload']||'上传素材'
export const coverTypeForMedia=(type:string)=>type==='screenshot'||type==='design'?type:type==='upload'?'upload':'concept'
