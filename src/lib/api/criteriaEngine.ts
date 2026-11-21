import{ supabase }from"@/lib/runtime/appSupabaseClient";
export type CriteriaStatus={criteria_id:string;version:string;status:"draft"|"review"|"approved"|"retired";can_evaluate:boolean;blockers:string[];config:Record<string,unknown>;limitations:string[]};
export type ContextualRiskSummary={assessment_id:string;cycle_id:string;risk_key:string;status:string;criteria_version:string;input_snapshot:Record<string,unknown>;output_snapshot:Record<string,unknown>|null;content_sha256:string|null;author_id:string;reviewer_id:string|null};
async function rpc<T>(name:string,args:Record<string,unknown>):Promise<T>{const{data,error}=await supabase.rpc(name as never,args as never);if(error)throw error;return data as T;}
export const fetchCriteriaStatus=(organizationId:string)=>rpc<CriteriaStatus[]>("get_criteria_engine_status",{_organization_id:organizationId});
export const listContextualRiskAssessments=(organizationId:string)=>rpc<ContextualRiskSummary[]>("list_contextual_risk_assessments",{_organization_id:organizationId});
export const computeContextualRiskAssessment=(assessmentId:string)=>rpc<Record<string,unknown>>("compute_contextual_risk_assessment",{_id:assessmentId});
export const applyContextualRiskOverride=(assessmentId:string,field:string,value:number,rationale:string,sourceRef:string)=>rpc<void>("apply_contextual_risk_override",{_id:assessmentId,_field:field,_value:value,_rationale:rationale,_source_ref:sourceRef});
export const advanceContextualRiskAssessment=(assessmentId:string,target:string,rationale:string)=>rpc<void>("advance_contextual_risk_assessment",{_id:assessmentId,_target:target,_rationale:rationale});
