import { Resume, JobDescription, Evaluation } from '../types';

// Mock AI service for demo purposes
class EvaluationService {
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  private calculateSkillMatch(resumeSkills: string[], requiredSkills: string[]): number {
    if (requiredSkills.length === 0) return 100;
    
    const matchCount = requiredSkills.filter(required => 
      resumeSkills.some(skill => 
        skill.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
    
    return (matchCount / requiredSkills.length) * 100;
  }

  private generateSkillsBreakdown(resume: Resume, job: JobDescription) {
    const allSkills = [...job.mustHaveSkills, ...job.niceToHaveSkills];
    return allSkills.map(skill => {
      const isFound = resume.extractedSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(resumeSkill.toLowerCase())
      );
      
      const confidence = isFound ? 85 + Math.random() * 15 : Math.random() * 30;
      
      return {
        skill,
        status: isFound ? 'found' : 'missing' as 'found' | 'missing' | 'partial',
        confidence: Math.round(confidence)
      };
    });
  }

  private generateFeedback(resume: Resume, job: JobDescription, score: number): string {
    const feedback = [];
    
    if (score >= 75) {
      feedback.push("🎉 Excellent match! This candidate demonstrates strong alignment with the role requirements.");
    } else if (score >= 50) {
      feedback.push("✅ Good potential match. Some areas for improvement identified below.");
    } else {
      feedback.push("⚠️ Limited match. Significant skill gaps identified that may require addressing.");
    }
    
    feedback.push("\n📈 Improvement Recommendations:");
    
    const missingSkills = job.mustHaveSkills.filter(skill =>
      !resume.extractedSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    if (missingSkills.length > 0) {
      feedback.push(`• Develop skills in: ${missingSkills.slice(0, 3).join(', ')}`);
      feedback.push("• Consider taking relevant online courses or certifications");
    }
    
    feedback.push("• Highlight specific projects that demonstrate relevant experience");
    feedback.push("• Quantify achievements with metrics and impact statements");
    
    if (score < 50) {
      feedback.push("\n🎯 Priority Actions:");
      feedback.push("• Focus on building foundational skills for this role");
      feedback.push("• Consider internships or entry-level positions to gain experience");
    }
    
    return feedback.join('\n');
  }

  private detectBias(jobDescription: string): string[] {
    const biasKeywords = [
      { pattern: /\bninja\b/gi, flag: "Term 'ninja' may exclude candidates who prefer clear job titles" },
      { pattern: /\brock\s*star\b/gi, flag: "Term 'rockstar' may be perceived as unprofessional" },
      { pattern: /\byoung\b/gi, flag: "Age-related language detected - may discriminate against older candidates" },
      { pattern: /\benergetic\b/gi, flag: "Term 'energetic' could be interpreted as age-biased" },
      { pattern: /\bguys?\b/gi, flag: "Gendered language detected - consider using 'team' or 'everyone'" },
    ];
    
    const flags: string[] = [];
    biasKeywords.forEach(({ pattern, flag }) => {
      if (pattern.test(jobDescription)) {
        flags.push(flag);
      }
    });
    
    return flags;
  }

  async evaluateResume(resume: Resume, job: JobDescription): Promise<Evaluation> {
    // Simulate API processing time
    await this.mockDelay(2000);
    
    // Calculate hard score (keyword matching)
    const hardScore = this.calculateSkillMatch(resume.extractedSkills, job.mustHaveSkills);
    
    // Simulate soft score (semantic similarity)
    const softScore = 45 + Math.random() * 40; // Mock semantic analysis
    
    // Calculate overall score
    const relevanceScore = Math.round(hardScore * 0.6 + softScore * 0.4);
    
    // Determine verdict
    let verdict: 'High' | 'Medium' | 'Low';
    if (relevanceScore >= 75) verdict = 'High';
    else if (relevanceScore >= 50) verdict = 'Medium';
    else verdict = 'Low';
    
    // Find missing skills
    const missingSkills = job.mustHaveSkills.filter(skill =>
      !resume.extractedSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // Find matched skills
    const matchedSkills = job.mustHaveSkills.filter(skill =>
      resume.extractedSkills.some(resumeSkill =>
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    const skillsBreakdown = this.generateSkillsBreakdown(resume, job);
    const feedback = this.generateFeedback(resume, job, relevanceScore);
    const biasFlags = this.detectBias(job.description);
    
    return {
      id: Date.now().toString(),
      resumeId: resume.id,
      jobId: job.id,
      relevanceScore,
      hardScore: Math.round(hardScore),
      softScore: Math.round(softScore),
      verdict,
      missingSkills,
      matchedSkills,
      feedback,
      skillsBreakdown,
      biasFlags,
      evaluatedAt: new Date().toISOString()
    };
  }

  async batchEvaluate(resumes: Resume[], job: JobDescription): Promise<Evaluation[]> {
    // Simulate batch processing
    const evaluations: Evaluation[] = [];
    
    for (const resume of resumes) {
      const evaluation = await this.evaluateResume(resume, job);
      evaluations.push(evaluation);
    }
    
    return evaluations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export const evaluationService = new EvaluationService();