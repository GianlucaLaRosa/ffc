/** Oral abstract section copy from the 2025 investigator brochure (left-title / right-body). */
export type SeedAbstractSection = { title: string; description: string }

export const ABSTRACT_CONTENT: Record<number, SeedAbstractSection[]> = {
  1: [
    {
      title: 'Background and rationale',
      description:
        'The Italian Cystic Fibrosis Research Foundation funded two post-marketing observational studies to evaluate the real-world effectiveness and safety of elexacaftor/tezacaftor/ivacaftor (ETI) in people with cystic fibrosis (pwCF), aged ≥12 years, heterozygous for F508del and a minimal function mutation (F/MFM). The ongoing study investigates pwCF with normal or mild-to-moderate lung disease over 2 years, and those with advanced disease from the previous study (Kaftrio in advanced disease) over 4 years of follow-up.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The project aims to assess the long-term clinical effects of ETI in a real-world setting across different levels of lung disease severity. Additional aims include evaluating individual re-sponsiveness, identifying reasons for lack of clinical improvement, and comparing clinical benefits and adverse events according to disease severity.',
    },
    {
      title: 'Essential methods',
      description:
        'Eighteen Italian CF Centers are participating. PwCF are categorized into two groups: Group A (ppFEV1 <40%, advanced disease) and Group B (ppFEV1 ≥40%, normal/mild-to-moderate disease). Demographic and clinical data were collected retrospectively for 2 years before and prospectively for 2–4 years after ETI initiation. Primary outcomes include changes in ppFEV1, sweat chloride concentration, antibiotic use, BMI, and quality of life. Secondary outcomes include adverse events and treatment discontinuation. Two sub-studies will explore: i) the correlation between CFTR activity and rescue with ETI in nasal epithelial cells and clinical response; ii) phenotypic and genotypic changes in Pseudomonas aeruginosa after prolonged ETI treatment in responders and non-responders.',
    },
    {
      title: 'Preliminary results',
      description:
        'The study is ongoing and will conclude in 2026. Due to delays in approvals from each hospital, patient enrollment began in August 2025. As of that date, 58 pwCF have been enrolled in Group B from 7 centers, and 103 in Group A.',
    },
    {
      title: 'Conclusions',
      description:
        'Real-world evidence on ETI remains limited. However, data from other studies confirm its safety and sustained clinical benefits over two years. The present study will provide valuable long-term data on the effectiveness and safety of ETI, supporting informed clinical decision-making in people with CF.',
    },
  ],
  2: [
    {
      title: 'Background and rationale',
      description:
        'We previously demonstrated that tezacaftor inhibits the enzyme (DEGS) that converts dihydroceramides (dHCer) into ceramides, thus producing an accumulation of dHCer in various cells and tissues. DEGS dysfunction and the resulting accumulation of dHCer are known to cause developmental disorders of the peripheral nervous system (PNS) and central nervous system (CNS), mainly due to an imbalance in myelin formation and maintenance. We here conducted an in vivo safety study to investigate the effects of ETI administration during pregnancy and breastfeeding.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We have evidence of an inhibitory effect of the triple combination drug Kaftrio (elexacaftor, tezacaftor and ivacaftor, ETI) on DEGS. Therefore, we hypothesise that the use of ETI during pregnancy and in the early phases of human development might be potentially at risk of causing alterations in the physiological neurodevelopment and myelination process.',
    },
    {
      title: 'Essential methods',
      description:
        'To rule out our concerns, we conducted an in vivo safety study by administering ETI to CD-1 mice during pregnancy and breastfeeding. ETI was incorporated into mouse food (in a high-fat diet regimen). Pups’ behaviour was measured with SHIRPA tests. ETI and dHCer levels in plasma and tissues, as well as changes in the global lipidome, were measured by tandem mass spectrometry coupled to liquid chromatography.',
    },
    {
      title: 'Preliminary results',
      description:
        'We already demonstrated that the molecule responsible for the inhibitory effect on DEGS is tezacaftor and that a slight dHCer accumulation occurs in the brain of mice administered with ETI for 5 days. Here, at 10 days after birth, we observed a significant accumulation of dHCer in the brains of pups born from ETI-fed dams compared to controls. No accumulation was observed in the sciatic nerve of these animals, likely due to much lower levels of ETI compared to the brain. We also conducted an untargeted lipidomics survey, which revealed other alterations in lipid metabolism associated with exposure to ETI during pre-gnancy. During breastfeeding, given the negligible exposure to the drug, these alterations revert and virtually disappear at 28 days after birth, together with other differences in the phenotype and behaviour of the pups observed earlier during development.',
    },
    {
      title: 'Conclusions',
      description:
        'We here demonstrate that exposure to ETI during pregnancy is associated with observable molecular changes in the brain lipidome, which are not likely limited to the inhibition of DEGS. These changes are reverted when exposure to ETI ceases.',
    },
  ],
  3: [
    {
      title: 'Background and rationale',
      description:
        'VOMG is a new molecule with bactericidal activity against Mycobacterium abscessus (Mab) and other cystic fibrosis (CF) pathogens due to a novel mechanism of action targeting cell division. Standard Mab treatments typically involve several drugs. VOMG demonstrated suitability for combination therapy, since no antagonism was verified with any of the antimicrobials currently used in Mab therapy; however, neither any synergistic effect was detected. Interestingly, synergism between VOMG and Kaftrio, used for gene corrector therapies in CF, was detected against Mab.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Were Kaftrio to enhance the activity of VOMG, it could be also playing additional synergistic activities with other antimicrobials used in CF therapy. The aim of this study is i) to investigate the interaction profile of Kaftrio with other antibiotics currently used to treat Mab infections in CF and ii) to further characterize the combination of VOMG plus Kaftrio in animal models.',
    },
    {
      title: 'Essential methods',
      description:
        'We used classical in vitro methods such as Minimum Inhibitory Concentration assays and Time Kill Assays, and more advanced methodologies such as High Throughput Synergy Screens and the Hollow Fiber System to characterize the activity of the compounds and combinations against Mab. We also used novel mouse models to characterize the efficacy of the combinations in vivo.',
    },
    {
      title: 'Preliminary results',
      description:
        'CFTR modulators compounds, ivacaftor, tezacaftor and elexacaftor, did not show activity alone, in pair-wise or triple combination (Kaftrio) against Mab. However, a positive interaction was observed when VOMG was combined with each gene modulator. The quadruple interaction VOMG plus Kaftrio strongly enhanced the activity. To better study the drug interactions of CFTR modulators with currently used antimicrobials, a synergy screen was performed using compounds commonly employed against Mab. Five were selected (amikacin, bedaquiline clarithromycin, imipenem and tigecycline) for secondary validation combinatorial time-kill kinetics using a broad panel of clinical isolates.',
    },
    {
      title: 'Conclusions',
      description:
        'Kaftrio could have a dual effect in CF therapy, as a CFTR corrector and by improving the antimicrobial activity of currently used antimicrobials and VOMG.',
    },
  ],
  4: [
    {
      title: 'Background and rationale',
      description:
        'Integration of mental health (MH) screening and treatment into cystic fibrosis (CF) care represents over 10 years of research and clinical progress, driven by elevated rates of depression and anxiety in the first TIDES study (The International Depression and Anxiety Epidemiological Study), development of international MH guidelines, and implementation of MH screening for adolescents and adults. However, TIDES did not include children under 12 years. Depression and anxiety have increased dramatically in young children, with new screening guidelines in primary care. Given the pediatric MH crisis and widespread adoption of new CFTR modulators, with negative side effects, there is an urgent need to collect MH data on children under 12 years.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study aims to: i) evaluate Italian longitudinal prevalence of depression, anxiety and behaviour problems in children aged 2-11; ii) compare the performance of two widely used measures, Pediatric Symptom Checklist (PSC) and PROMIS Modules, in ascertaining these symptoms to identify the optimal screener; and iii) characterize the neuropsychological side-effects of modulator therapy. Comparisons of MH symptoms and side effects will be made in Italy and the US.',
    },
    {
      title: 'Essential methods',
      description:
        'This is a longitudinal, observational epidemiological study. We will enrol 500 children with CF under 12 years consecutively at 11 Italian CF Centers, generating national prevalence estimates for preschool and school-age children. Parents and children will complete a comprehensive assessment of MH problems twice during routine visits, separated by 6-9 months: PSC, PROMIS (sleep, cognition, emotional functioning), SDQ for convergent validity, CFQ-R (QOL), modulator side-effects and for parents, PHQ-9, GAD-7, and CF-PAS (procedural anxiety). Surveys will be administered via iPad using REDCap, a secure, private web-based tool.',
    },
    {
      title: 'Preliminary results',
      description:
        'A higher prevalence of MH problems will be found in children with CF compared to published norms, and both PSC and PROMIS will demonstrate adequate reliability (α > 0.70), sensitivity and specificity (> 0.80). Prevalence estimates will be generated, and the best brief screener will be identified to update the international MH guidelines for children under 12 years in the EU.',
    },
    {
      title: 'Conclusions',
      description:
        'Use of these screening measures will facilitate the development of prevention and inter-vention efforts for young children and their parents to improve daily functioning and quality of life. MindKids-CF will contribute to provide critical evidence to extend MH screening and care to younger children with CF in the EU and US.',
    },
  ],
  5: [
    {
      title: 'Background and rationale',
      description:
        'CFTR modulators improve lung function in cystic fibrosis (CF), but extrapulmonary complications like cystic fibrosis-related diabetes (CFRD) persist. We studied insulin secretion defects and glucose tolerance in 600 people with CF (2013-2023), mainly before modulator availability, to assess their long-term impact.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study investigated whether pre-existing insulin secretory defects predicted dysglycemia, respiratory function decline, malnutrition, cardiometabolic risks, and mortality in CF. We also assessed whether modulators mitigated these effects.',
    },
    {
      title: 'Essential methods',
      description:
        'This retrospective study is analyzing data from our 2013-2023 cohort. We are extracting clinical outcome data and CFTR modulator therapy information from patient records and correlating these with previously collected glucose tolerance and insulin secretion data.',
    },
    {
      title: 'Preliminary results',
      description:
        'Data acquisition from patient records is actively underway. Our foundational analyses on the baseline cohort data have provided critical insights. We identified a dynamic pattern of insulin secretion around puberty and a progressive decline in β-cell glucose sensitivity with age, which correlated with poorer lung function and nutritional status. Furthermore, we have now characterized the phenomenon of reactive hypoglycemia as another manifestation of early glucose intolerance. Our data show this is caused by a large amount of insulin being secreted late in the OGTT, causing hypoglycemia. These findings were presented at the 48th European Cystic Fibrosis Conference. This body of work underscores the clinical relevance of early metabolic monitoring and provides a strong rationale for the current comprehensive outcome analysis.',
    },
    {
      title: 'Conclusions',
      description:
        'This study is poised to deliver a definitive understanding of the long-term consequences of early insulin secretory defects in CF. We expect to quantify the impact of these defects and provide an assessment of the effectiveness of CFTR modulators in mitigating glycemic progression and its comorbidities. The final results will be instrumental for refining clinical guidelines for CFRD screening, leading to more personalized, risk-stratified treatment strategies.',
    },
  ],
  6: [
    {
      title: 'Background and rationale',
      description:
        'Cystic fibrosis (CF) is caused by mutations that impair the CFTR ion channel function. 40 rare mutations display limited response to Kaftrio exposure, and novel therapeutic interventions are required. No experimentally determined CFTR structure exists in an open-channel state. Molecular dynamics (MD) simulations provide a powerful tool to complement experimental approaches, allowing the characterization of conformational landscapes, allosteric communication, and drug-protein interactions.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The additive effect of preclinical class-II potentiators in combination with VX-445 (classIII) and VX-770 (class-I) potentiators shows that gating defective CFTR variants can be further activated by additional drugs. Poor pharmacophore properties of available classII potentiators need significant improvement. We aim at developing poly-specific class-II potentiators that activate the gating of several CFTR mutants in combination with known drugs and to characterize their mechanism of action at the molecular level. We also hypothesize that MD simulations can reveal how lipid composition, mutations, and therapeutic compounds reshape CFTR’s conformational dynamics and allosteric communication.',
    },
    {
      title: 'Essential methods',
      description:
        'Chemical optimization to further improve the rescue potency and efficacy of our best classII potentiator hits was conducted. Functional studies on several poorly responsive CFTR variants were conducted in immortalized and primary human airway cells. The potentiation mechanism and toxicity profile of the best compounds were established. We performed multi-microsecond MD simulations using open and closed CFTR conformations, in either pure POPC or mixed lipid bilayers.',
    },
    {
      title: 'Preliminary results',
      description:
        'We have demonstrated that at least 3 binding sites for potentiator exist in CFTR. Starting from our new correctors that synergize with approved drugs, we have developed new classII potentiators that improved the G551D-, and N1303K-CFTR function in concert with the class-I and -III potentiators and correctors of Kaftrio. We have identified the structural determinant for switching from correctors to potentiators and proposed a potential binding site. Preliminary MD results highlight distinct allosteric pathways between the nucleotide-binding domains and transmembrane helices.',
    },
    {
      title: 'Conclusions',
      description:
        'New potentiators for CFTR mutations with poor responsiveness to approved drugs are ongoing. Compounds will be further developed considering the outcomes from in silico studies. MD simulations provide critical insights beyond static structures, offering a framework to investigate how drugs and mutations modulate CFTR function. Our project aims at the development of more effective and tailored therapies for people with CF and to provide a computational platform to optimize therapies.',
    },
  ],
  7: [
    {
      title: 'Background and rationale',
      description:
        'Kaftrio represents the current standard pharmacological treatment for people with cystic fibrosis (CF) carrying at least one copy of the F508del mutation in the CFTR gene. Its use has been extended by EMA in 2025 to patients who have at least one non-Class I mutation. Despite the remarkable results achieved, optimization of Kaftrio therapy remains both necessary and feasible. This is particularly important in view of its application to a wide range of mutants, for whom therapeutic efficacy may be limited.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We aimed to screen a panel of molecules that share the ability to activate heat shock pro-teins (HSPs). We hypothesized that activating the HSPs would improve the ability of correctors to rescue F508del-CFTR.',
    },
    {
      title: 'Essential methods',
      description:
        'CFBE41o- cells expressing F508del-CFTR were treated with HSP activators in the presence or absence of VX-445/VX-661. Functional rescue of the channel was assessed by western blotting and the YFP assay. Channel stability was evaluated using the cycloheximide assay, while CFTR expression was measured by qPCR. The most effective compounds were then tested in 16HBE gene-edited cells carrying the endogenous F508del mutation. Finally, compounds that proved effective in both models were evaluated in primary patient-derived cells homozygous for F508del-CFTR using Ussing chamber assays. Experiments on primary cells were performed in collaboration with the CFaCore facility and Primary Cultures Service by FFC Ricerca.',
    },
    {
      title: 'Preliminary results',
      description:
        'We tested a subset of HSP-activating molecules. Two of these showed efficacy in both CFBE cells and gene-edited cells in potentiating the effects of correctors on the rescue of F508del-CFTR. One of the two compounds was also effective in patient-derived cells, although apparently through a mechanism different from that initially expected. Evaluation of the second compound in patient cells is currently ongoing.',
    },
    {
      title: 'Conclusions',
      description:
        'Although we have not yet been able to determine the precise role of HSPs in the functional rescue of F508del-CFTR, the selection of a group of compounds capable of activating HSPs allowed the identification of one compound, already approved as a drug for another pathology, with efficacy in patient-derived cells in potentiating the effect of correctors. A second, very promising compound is currently under evaluation to determine its efficacy in patient cells.',
    },
  ],
  8: [
    {
      title: 'Background and rationale',
      description:
        'Regulation of CFTR trafficking requires integrity of correct cytoskeletal organization, because the cytoskeleton is responsible for the scaffolding that stabilizes CFTR at the plasma membrane (PM) and brings several interacting proteins to CFTR’s proximity, among which cAMP sensors, such as protein kinase A and EPAC1, have a prominent role',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'As we aim at characterizing the crosstalk between the cytoskeleton and cAMP signalling in the regulation of CFTR traffic, we focused here on the role of the cAMP sensor EPAC1, the capping protein CAPZA2 and the inverted formin INF2, and on their possible role in the regulation of CFTR trafficking.',
    },
    {
      title: 'Essential methods',
      description:
        'We used primary cultures of nasal epithelial cells isolated from individuals with CF, CF bronchial epithelial cells expressing wild-type or mutant CFTR, and analyzed them using Western blot, co-immunoprecipitation and cell surface biotinylation. We also performed live cell imaging to assess cAMP pools and proximity labelling to isolate INF2 interactors.',
    },
    {
      title: 'Preliminary results',
      description:
        'Results show that: i) Knockdown (KD) of INF2 and CAPZA2 affects cytosolic and membrane-associated cAMP pools in CFBE wt and F508del cells. ii) EPAC1 activation in CFBE mCherry-FLAG-CFTR increases the association of wtCFTR with NHERF1, with the opposite occurring for F508del-CFTR. iii) INF2 is detected in nasal epithelial cells as the full-length protein and as a lower molecular weight isoform, whose expression is not detected in established cell lines. iv) The fusion between ER- INF2 and biotin ligase TurboID can be transfected into CFBE cells and increases the amount of recovered biotinylated proteins, prompting the identification of the INF2 interactome in these cells. v) A bioinformatic analysis performed to derive an MS/MS-based method for ranking of proteins relevant to CFTR PM stabilization allowed the identification of proteins relevant for PM stability for wt- or F508del-CFTR.',
    },
    {
      title: 'Conclusions',
      description:
        'The findings of the second year confirm that regulation of CFTR by EPAC1, INF2 and CAPZA2 is complex, highlighting the relevance of exploring their role in the crosstalk between cAMP signalling pathways and the cytoskeleton to affect CFTR modulation, and possibly CF handling.',
    },
  ],
  9: [
    {
      title: 'Background and rationale',
      description:
        'A significant progress has been obtained in the pharmacological treatment of cystic fibrosis (CF) with the development of correctors (VX-809, VX-661, VX-445) and potentiators (VX-770) that, in combination, can restore the function of mutant CFTR. However, the identification of new CFTR modulators may offer further possibilities for maximal CFTR rescue. The project Molecules 3.0 aims at the development of novel CFTR correctors endowed with maximal potency and efficacy.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Our previous efforts, led to the identification of a new class of small molecules (called PP compounds) that have a tricyclic core and act as correctors with high efficacy in the rescue of F508del-CFTR on native epithelial cells of CF patients, particularly in combination with class 1 correctors. PP compounds appear to work with a class 3 corrector mechanism, through the interaction with the second membrane spanning domain (MSD2) of the CFTR protein. Our objective is to improve this interaction through a wide campaign of chemical synthesis, aiming at a multiparametric optimization of PP compounds. Within this campaign, a scaffold hopping strategy led to the identification of SH compounds, derived from the parent tricyclic core structure. These compounds bear a higher conformational flexibility and offer multiple re-gions for structural diversification with high optimization opportunities.',
    },
    {
      title: 'Essential methods',
      description:
        'We explored three different regions of PP and SH families on the basis of their predicted interaction with CFTR (lasso domain and transmembrane helices 10-11). Iterative cycles of chemical synthesis and functional evaluation on CFBE41o- cells expressing F508delCFTR allowed the identification of the most promising compounds that were then validated on primary bronchial epithelial cells from people with CF.',
    },
    {
      title: 'Preliminary results',
      description:
        'In vitro and in silico studies oriented the synthesis towards a structure elongation, to increase the number of chemical interactions with the CFTR protein, and the insertion of a fluorine in a specific position. Interestingly, two promising subgroups of PP compounds, named FLM and AL, were also found. In general, nearly 550 compounds have been obtained so far, belonging to the two families, PP and SH, from which several effective candidates have been identified. These compounds are effective in improving CFTR function in short-circuit current recordings on epithelia from people with CF. A selected number of compounds was also tested in FRAP experiments, showing the ability to decrease apical fluid viscosity in CF epithelia. In vivo pharmacokinetic studies on mice done for PP028 and SH157A at the Italian Institute of Technology (IIT) indicated moderate oral bioavailability, which needs to be improved.',
    },
    {
      title: 'Conclusions',
      description:
        'So far, we have devoted many efforts to exploring the chemical space around the PP and SH scaffolds to maximize the possibility of obtaining compounds endowed with the characteristics needed to reach preclinical and clinical studies. This search has revealed a panel of small molecules with promising characteristics.',
    },
  ],
  10: [
    {
      title: 'Background and rationale',
      description:
        'Genome editing holds great promise for correcting CFTR mutations in cystic fibrosis (CF). While efficient CFTR correction has been shown in experimental models, delivery methods remain a major challenge, especially for the lungs, the primary site of disease. Engineered vesicles represent a promising system to deliver genome editing tools, offering transient expression to reduce off-target effects and tunable tissue tropism.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study aims to develop GE-vesicles, a new system to deliver genome editing complexes as ribonucleoproteins to airway epithelial cells. This approach ensures transient expression of the cargo, enabling correction of the CFTR gene while minimizing undesired genomic alterations.',
    },
    {
      title: 'Essential methods',
      description:
        'GE-vesicles were engineered to carry different CRISPR tools, including ABE8e-SpCas9, SpCas9, and AsCas12a. Production protocols were optimized to maximize editor and sgRNA incorporation. Particles were characterized for size, concentration, and cargo content.',
    },
    {
      title: 'Results',
      description:
        'We demonstrated successful incorporation of base editors (ABE8e-SpCas9) and nucleases (SpCas9, AsCas12a) into GE-vesicles. Editing efficiency reached up to 60% with ABE and 80% with Cas9 in HEK293T and CFBE41o- cells. We evaluated the efficiency of ABE-GE-vesicles in correcting the R553X nonsense mutation, achieving up to 25% correction in 16HBE-R553X cells, and of Cas9-GE-vesicles in targeting the 3849+10kb C>T mutation, reaching up to 50% deletion in HEK293T cells. We aim to modify the tropism of GE-vesicles by incorporating envelopes derived from different viruses to ensure efficient delivery of the genome editing complex to airway cells. The most effective envelope in vitro was selected for further testing in CF patient-derived airway cells and in mice.',
    },
    {
      title: 'Conclusions',
      description:
        'GE-vesicles represent a promising delivery strategy for genome editing in CF. Their tunability and efficiency support their use not only for CF but also for other lung and genetic diseases, addressing a major bottleneck in the clinical translation of genome editing for the lung.',
    },
  ],
  11: [
    {
      title: 'Background and rationale',
      description:
        'Cystic fibrosis (CF) is caused by mutations in the CFTR gene, leading to defective chloride channel function. While modulators such as Kaftrio have improved prognosis, many patients remain without effective therapy. Gene replacement or correction strategies hold therapeutic potential, but progress is delayed by the lack of efficient and safe delivery systems to the lung.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The GenDel-CF project aims to overcome current barriers in pulmonary gene therapy by developing innovative delivery systems for CFTR mRNA and CRISPR-based editing tools. We aim to prove that advanced lipid nanoparticles (LNPs) and engineered genome-editing vesicles (GE-vesicles) can achieve stable, tissue-specific, and safe delivery to airway epithelia. Objectives include: i) design and optimization of lipid and vesicular carriers, ii) validation of functional correction in patient-derived airway epithelia, and iii) preclinical evaluation in mouse models.',
    },
    {
      title: 'Essential methods',
      description:
        'We combined lipid chemistry, RNA formulation, and synthetic biology to generate LNPs and GE-vesicles with tailored lung tropism. LNP stability and mRNA encapsulation efficiency were assessed by dynamic light scattering, field-flow fractionation, and RiboGreen assays. Functional testing was performed in CFBE41o- cells and differentiated primary bronchial epithelia grown at air-liquid interface (ALI). In vivo efficacy was tested in reporter and CF mouse models after intra-tracheal and/or intravenous administration.',
    },
    {
      title: 'Preliminary results',
      description:
        'The GenDelCF consortium produced LNP formulations for the delivery of mRNA. The LNP were demonstrated to be stable and with high encapsulation capacity. The delivery efficacy was tested in cell lines, in ALI culture and in an in vivo model by using specific reporter systems, which allowed to screen and identify the best-performing LNP. We have obtained LNP formulations that allow efficient delivery of mRNA both in vivo and in primary cells. In parallel, we developed GE-vesicles to deliver protein-RNA complexes, which showed a high level of genome editing using diverse types of genome editing tools (base editors and nucleases). We have identified novel targeting molecules for the bronchial epithelium that should enable efficient delivery via GE-vesicles, with promising potential for translation to LNP platforms.',
    },
    {
      title: 'Conclusions',
      description:
        'Together, these preliminary results demonstrate the feasibility of diverse platforms for pulmonary gene therapy. The consortium has generated stable LNPs and GE-vesicles with promising tropism and editing activity. Expected final results include the identification of optimal carriers for in vivo CFTR correction and proof-of-concept for functional rescue. These advances are an important step toward curing CF and could also lead to new RNA and gene editing treatments for other lung diseases.',
    },
  ],
  12: [
    {
      title: 'Background and rationale',
      description:
        'Although highly effective CFTR modulator therapy (HEMT) is providing major benefits to people with cystic fibrosis (pwCF), the inflammatory processes progressively damaging pulmonary tissues are not halted. Thus, there is an urgent need for new anti-inflammatory agents complementary to HEMT to be given by the pulmonary route to pwCF.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We developed GY971, showing anti-inflammatory action based on the regulation of the abnormal neutrophil chemotaxis in CF bronchial epithelial cells in vitro and murine lungs in vivo. We hypothesize that GY971 could be developed to obtain an innovative anti-in-flammatory drug tailored to the needs of pwCF. To this goal, we wish to consolidate and extend the evidence of its anti-inflammatory efficacy and collect preliminary safety data.',
    },
    {
      title: 'Essential methods',
      description:
        'GY971 was tested in human primary bronchial and nasal epithelial cells obtained ex vivo from different pwCF carrying the F508del mutation and infected with Pseudomonas aeruginosa (PAO-1). Moreover, GY971 was in vivo administered in a new zebrafish model infected with PAO-1. In addition, whole human blood was used to study possible COX-1 and COX-2 inhibition.',
    },
    {
      title: 'Preliminary results',
      description:
        'GY971 was confirmed to be able to reduce neutrophil chemotaxis mediators both in CF bronchial epithelial cell lines and in CF primary bronchial and nasal epithelial cells. The expression of key inflammatory proteins involved in CF lung disease, mainly IL-8, was significantly reduced using nanomolar concentrations. Importantly, GY971 did not interfere with the ETI-mediated rescue of CFTR protein, did not show cytotoxic effects and, at these concentrations, was unable to inhibit platelet COX-1 and LPS-induced COX-2 activity. In vitro analyses designed for early detection of potential clinical adverse drug reactions (ADRs) were completed, and NGS analyses are being finalized to conclude the safety data screening. Moreover, in vivo testing with a zebrafish model confirmed its effectiveness.',
    },
    {
      title: 'Conclusions',
      description:
        'GY971 appears to be a highly promising derivative for the future development of anti-in-flammatory CF treatments. It effectively mitigates inflammation and restores ETI-mediated CFTR function in the presence of bacterial exoproducts. The investigation into the efficacy of GY971 will be extended to in vivo murine models of chronic inflammation, with daily administration via aerosol delivery.',
    },
  ],
  13: [
    {
      title: 'Background and rationale',
      description:
        'Accumulating evidence suggests that people with cystic fibrosis (pwCF) generate insufficient T-cell responses, which contribute to excessive inflammation. Among other factors, platelets (PLTs) play a key role in CF inflammation as they can alter the response of various immune cells, including CD8 T lymphocytes.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The central hypothesis of the proposed research is therefore that PLTs dampen CD8 actions to fuel CF inflammation. Targeting PLT-CD8 crosstalk could therefore be beneficial. The study addresses the following objectives: i) determine how PLTs affect CD8s; ii) evaluate the impact of PLT-CD8 crosstalk on airway inflammation; iii) test strategies to pro-mote CD8 reactivation and the resolution of inflammation.',
    },
    {
      title: 'Essential methods',
      description:
        'We used purified blood cells from pwCF and healthy donors (HD); reconstituted lung-on-chip models; in vivo models of lung bacterial infection; proteomics and phosphoproteomics assays.',
    },
    {
      title: 'Preliminary results',
      description:
        'Our ongoing work highlights global proteomic and phosphoproteomic changes in PLTs that affect their interaction with adaptive immune cells. We have also demonstrated an increase in circulating PLT/CD8 aggregates i) in pwCF compared to HD due to PLT hyperactivity, ii) in vivo in the airways of CF mice and iii) in a reconstituted lung-on-chip model with human cells. CD8+ T cells in PLT/CD8 aggregates in pwCF express high levels of exhaustion markers and have lower cytotoxic ability. Thus, PLTs stimulate the differentiation of CD8 T cells towards dysfunction. Reinvigorating CD8 T cell function with the immune checkpoint inhibitor anti-PD-1 alleviated bacterial infection and inflammation in vivo in CF mice.',
    },
    {
      title: 'Conclusions',
      description:
        "During the first year, we established that PLTs interact with CD8 T cells and that these aggregates may play a pathological role in CF airway disease. These studies are highly re-levant to the FFC Ricerca's mission to promote innovative treatment and care for CF, as they investigate innovative strategies to limit inflammation-based pathology by targeting a previously unexplored pathological mechanism. This proposal will also shed more light on the functions of adaptive cells in CF and pave the way for new research aimed at dissecting the role of CF lymphocytes.",
    },
  ],
  14: [
    {
      title: 'Background and rationale',
      description:
        'CFTR modulators like elexacaftor/tezacaftor/ivacaftor (ETI, or Kaftrio) have fundamentally transformed cystic fibrosis (CF) treatment. Nevertheless, significant knowledge gaps persist regarding the variability of patient response to lung inflammation and the precise mechanism by which ETI influences the complex host immune defense system. This indicates that our understanding of the deep functionality of these drugs is still incomplete.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The main goal of this project is to study the effects, mechanisms and interactions of the drug ETI on the body’s ability to resolve inflammation and infections in the lungs of people with CF. The persistent, damaging lung inflammation in CF is exacerbated by a deficiency in SPM consequent to the underlying CFTR defect. This study posits that CFTR modulators, like ETI, exhibit a dual action: restoring CFTR protein function and upregulating SPM. This is proposed to re-educate inflammation in people with CF, shifting this response from a destructive to a protective mechanism.',
    },
    {
      title: 'Essential methods',
      description:
        'This is a cross-sectional study with volunteers with CF receiving ETI (n = 40) and an untreated cohort (n = 20). Peripheral blood and nasal swabs will be collected to quantify ETI and SPM concentrations in the systemic circulation (to track overall distribution throughout the body) and airways (to determine the levels reached in the main site of the disease). scRNAseq will be used to characterize changes in transcriptomic signatures of leukocytes and airway cells. Biostatistical analyses will subsequently determine if ETI elevates SPM in people with CF, how it modifies immune and epithelial cell phenotypes, and whether these changes correlate with local and systemic drug exposure.',
    },
    {
      title: 'Preliminary results',
      description:
        'In the first year, the recruitment of study participants and sample collection were completed. We developed a state-of-the-art, clinically validated method to precisely measure the concentration of the ETI drug: both in the blood and in the nasal wash fluids. Moreover, scRNA-Seq was initiated. The second year will focus on the in-depth analysis of the collected samples, including scRNAseq and SPM quantification.',
    },
    {
      title: 'Conclusions',
      description:
        'These results will reveal whether the inflammatory improvement seen in patients is directly due to increased SPM production and linked to the amount of ETI reaching the lungs, pro-viding the foundation for more targeted and effective CF treatment strategies in the future.',
    },
  ],
  15: [
    {
      title: 'Background and rationale',
      description:
        'A sustained inflammatory response represents a significant pathogenic factor of cystic fibrosis (CF) lung disease, even in the era of CFTR modulators. Pro-resolving pharmacology appears to be a valid alternative to the scarcely effective conventional anti-inflammatory treatments. Pro-resolving molecules include melanocortins, peptide hormones that activate specific receptors (MC1-5). Synthetic melanocortins are now in advanced clinical trials in various pathologies.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that melanocortins may have efficacy in controlling CF inflammation. The main objectives of the program are to: i) develop a 3D model of CF airways to verify the pro-resolving properties of synthetic melanocortins; ii) integrate evidence provided by 2D and 3D models as preclinical testing procedures in CF.',
    },
    {
      title: 'Essential methods',
      description:
        'We used 2D (transwell) and 3D (airway-on-a-chip) models, constructed with primary cells (respiratory epithelial or vascular endothelial) from people with CF, in the presence or not of bacterial infection (Pseudomonas aeruginosa), and of CF neutrophil leukocytes (PMNs). We examined the modulatory properties of BMS-470539 (BMS), a synthetic MCR1-selective agonist, and of α-MSH (pan MCR agonist). We assessed PMN recruitment and activation status, mucus production, transepithelial electrical resistance (TEER), cell monolayer integrity, cytokine and chemokine release, and the transcriptome of endothelial and epithelial cells.',
    },
    {
      title: 'Preliminary results',
      description:
        'Treatment with BMS (0.1-5 μM) resulted in increased TEER, associated with changes in mucus production and reduced PMN recruitment. However, these effects were donor-dependent. Less pronounced effects were observed with α-MSH. BMS also improved some dysfunctional parameters of CF endothelial cells.',
    },
    {
      title: 'Conclusions',
      description:
        'These results suggest that melanocortins may exert beneficial effects on specific components of the CF lung inflammatory response. However, the donor-dependent variability of these effects requires further study. Relevant insights may be provided by ongoing evaluations of cytokine and chemokine release and the transcriptomic profiles of the epithelium and endothelium.',
    },
  ],
  16: [
    {
      title: 'Background and rationale',
      description:
        'The airway epithelium deploys innate defense mechanisms that are further modulated during inflammation to boost its ability to fight pathogens and recruit immune cells. In cystic fibrosis (CF), the absence of chloride secretion through CFTR leads to dehydration of the airway surface, bacterial colonization, inflammation and lung damage. We found that bronchial epithelia (BE) exposed to IL-17A+TNF-α have upregulation of genes for antimicrobial peptides, chemotactic molecules for leukocyte recruitment, MUC5B mucin and ion channels/transporters (ENaC, CFTR, SLC26A4). IL-17A+TNF-α causes a hyperviscosity of the airway surface, which is reversed in non-CF epithelia by beta-adrenergic stimulation of CFTR. Moreover, BE releases extracellular vesicles (EVs), particularly upon cytokine stimulation.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that these properties of the airway surface may be involved in the innate defense response. We aim to i) identify potential bactericidal mechanisms coordinated by the airway epithelium and ii) define the properties and role of extracellular vesicles (EVs) released by BE.',
    },
    {
      title: 'Essential methods',
      description:
        'We used BE from non-CF and CF patients and performed Ussing chamber, FRAP and RNAseq experiments to evaluate changes in gene expression and ion transport elicited by cytokines. We dealt with PAO1 and RP73 bacteria to measure their diffusion on the airway surface. Regarding EVs, we performed serial centrifugation and capillary-automated immunoblot analysis, FACS and electron microscopy.',
    },
    {
      title: 'Preliminary results',
      description:
        'We have compared the effects of IL-17A and IL-17F. From RNAseq, short-circuit current recordings and FRAP, we found that IL-17F increased CFTR and TMEM16A activity and had a fluid surface, resembling a Th2 response. These results also suggest that the hyperviscous state induced by IL-17A is probably caused by ENaC and/or SLC26A4. Our data in BE with genetic ablation of SLC26A4 supports this finding. We found that the viscosity of the airway surface has an impact on bacterial diffusion. We further characterized the EVs in their molecular content and tested their ability to deliver cargo.',
    },
    {
      title: 'Conclusions',
      description:
        'Our results are relevant to better understanding the physiology of the airway surface in the context of inflammation and reveal new targets for therapeutic interventions (e.g. IL17RA, SLC26A4) in people with CF who cannot benefit from CFTR modulators.',
    },
  ],
  17: [
    {
      title: 'Background and rationale',
      description:
        'People with CF (pwCF) are prone to contracting bacterial lung infections by P. aeruginosa, known to be the major pathogen in the CF lung, leading to increased inflammatory response, significantly contributing to morbidity and mortality.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The patient-to-patient variation in Kaftrio response might be attributed to several mechanisms, including the different inflammatory responses and the related oxidative stress across patients. Therefore, in vitro studies of patient-specific response to anti-inflammatory/antioxidant compounds under infection could help elucidate the role of chronic inflammation and oxidative stress in drug resistance in order to develop personalized combination therapies.',
    },
    {
      title: 'Essential methods',
      description:
        'We performed a dose-response evaluation of 10 anti-inflammatory compounds in pre-clinical and clinical stages using CFBE cells. We analyzed the inflammatory and oxidative status by detecting specific markers. We investigated the gene expression and protein release of pro-inflammatory cytokines (using RT-qPCR and ELISA assays) and the antioxidant activity of these drugs by measuring intracellular ROS levels (using a ROS-sensitive fluorescent probe) in F508del-CFTR CFBE cells under inflammatory conditions.',
    },
    {
      title: 'Preliminary results',
      description:
        'Interestingly, we found that a few anti-inflammatory compounds, at specific doses, significantly reduced IL-6 and IL-8 cytokine levels (both mRNA and protein) in F508del-CFTR CFBE cells treated with IL-17A+TNFα. Other compounds, however, did not exhibit anti-inflammatory activity in the CFBE cell line. To further investigate the antioxidant activity of these compounds, we developed a high-throughput fluorometric assay to measure ROS levels using a ROS-sensitive fluorescent probe. We performed a dose-response drug screening to investigate their antioxidant activity. These compounds interestingly exhibited antioxidant activity, in a dose-dependent manner, in F508del-CFTR CFBE cells treated with H₂O₂.',
    },
    {
      title: 'Conclusions',
      description:
        'During the first year, we identified a few good compounds acting as anti-inflammatories and antioxidants in the F508del-CFTR CFBE cell line.',
    },
  ],
  18: [
    {
      title: 'Background and rationale',
      description:
        'Highly Effective CFTR Modulator Treatment (HEMT) has represented a breakthrough advancement in the treatment of people with cystic fibrosis (CF). However, clinical trials with Kaftrio showed that pulmonary inflammation is reduced but not halted, which implies the progression of lung damage. The anti-inflammatory drugs ibuprofen and azithromycin revealed adverse effects limiting their use. Novel effective and safe anti-in-flammatory drug to be associated with HEMT is an unmet need in the cure of CF.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Excessive recruitment of neutrophils in the lumen of CF bronchi is considered the main cause of lung damage, since neutrophils release enzymes that degrade protein structures (proteases), oxidizing reactive species and long DNA filaments, worsening the viscous CF surface liquid. Innovative anti-inflammatory strategies in trials are presently targeting one of these damaging mechanisms (neutrophil proteases). Our alternative strategy aims to downmodulate the excessive recruitment of neutrophils, thus the three harmful effectors, leaving active the anti-infective defences. The molecular target we devised is the excessive release of molecules that recruit neutrophils in the airways of CF. The anti-inflammatory molecule GY971, which we identified and propose for pulmonary delivery, European Medicines Agency designated Orphan Drug for CF, now needs to proceed to safety validation and development of formulations for pulmonary delivery.',
    },
    {
      title: 'Essential methods',
      description:
        'Pre-clinical safety experiments will be developed in different steps (in vitro toxicity testing on different cell lines, in vivo pharmacokinetics and toxicology in rats, in vivo organ distribution in mice) with GY971 in new delivery formulations. The preservation of its anti-in-flammatory efficacy will be tested in CF primary bronchial epithelial cells in vitro and in mice with pulmonary infection.',
    },
    {
      title: 'Preliminary results',
      description:
        'The project is already based on a series of positive preliminary safety verifications of GY971 in vitro, already obtained at the Universities of Padua and Ferrara, results that are encouraging the extensive and thorough experiments to be performed by SINTEF.',
    },
    {
      title: 'Conclusions',
      description:
        'The large series of positive pre-clinical results already obtained on the efficacy of GY971 as an anti-inflammatory molecule, which will be extended and accomplished in this project, will aim to provide solid bases for the clinical development of a novel anti-inflammatory drug for CF.',
    },
  ],
  19: [
    {
      title: 'Background and rationale',
      description:
        'Mycobacterium abscessus (Mab) is an emerging non-tuberculous mycobacterium (NTM) of clinical concern, particularly in individuals with cystic fibrosis (CF). Its treatment is complicated by intrinsic drug resistance, biofilm formation, and poor intracellular antibiotic efficacy. There is a critical need for novel, effective therapeutics. Through four projects funded by the Italian Cystic Fibrosis Research Foundation (FFC Ricerca), we identified VOMG, a promising new drug candidate, active in vitro against several NTM and other pathogens. It is water-soluble with high bactericidal activity against Mab growth, also in vivo. VOMG target is FtsZ cell division protein. Because of its physicochemical properties, it is suitable for novel drug delivery formulations, including aerosol inhalation.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study aimed to further study the mechanism of action of VOMG, to evaluate its in-tracellular and in vivo efficacy in combination with amikacin, and to develop relevant in-fection models.',
    },
    {
      title: 'Essential methods',
      description:
        'We used microbiological and biochemical methods to reach the aims of the project.',
    },
    {
      title: 'Results',
      description:
        'We optimized the CRISPR interference (CRISPRi) system for Mab and generated conditional mutants in genes involved in cell division (ftsZ, envC, steA, ftsQ, and sepF). The characterization of the FtsZ mutants confirmed its essentiality and it as VOMG target. We optimized both the Granuloma-like structure (GLS) assay and the macrophage monolayer models in Mab to evaluate drug activity. Among the tested antibiotics, clarithromycin and bedaquiline exhibited the highest efficacy. Although VOMG showed limited intracellular activity, its combination with amikacin enhanced antibacterial effects, consistent with the results achieved in two murine models of Mab infection.',
    },
    {
      title: 'Conclusions',
      description:
        'These findings validate FtsZ as the VOMG target and support its further development as a therapeutic candidate.',
    },
    {
      title: 'Appendix (FFC#11/2025)',
      description:
        'Future efforts will focus on enhancing intracellular delivery: in order to improve the bioavailability of VOMG, particularly in Mab-infected lungs, VOMG will be encapsulated in liposomes. The new VOMG formulation will be tested both in ex vivo assays and in Mab-in-fected murine models.',
    },
  ],
  20: [
    {
      title: 'Background and rationale',
      description:
        'Innate immune responses in macrophages are rapidly tuned by stimulus-dependent histone post-translational modifications (PTMs), yet how these chromatin changes interface with lipid metabolism and antigen presentation during nontuberculous mycobacterial infection remains unclear. We focused on histone H3 lysine 14 acetylation (H3K14ac), a modification associated with open chromatin and transcriptional activation, in alveolar-like macrophages (mAMs), the primary niche for Mycobacterium abscessus (Mab). Mab is a major cause of difficult-to-treat pulmonary disease in people with cystic fibrosis (pwCF), where chronic infection accelerates lung-function decline and complicates transplant eligibility, underscoring the need for host-directed strategies.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        "This project focuses on understanding how H3K14ac remodulation could enhance AMs' capacity to hinder Mab infection by shifting their polarization from a permissive to an eradicating phenotype.",
    },
    {
      title: 'Essential methods',
      description:
        'Using single-cell high-resolution confocal microscopy with multiparametric quantification, we mapped H3K14ac and MHC-II abundance in steady state, after pharmacologic histone Histone Deacetylase (HDAC) inhibition, and during early Mab infection. We complemented imaging with targeted transcriptomics and unbiased quantitative proteomics to define pathway-level shifts.',
    },
    {
      title: 'Results',
      description:
        'At baseline, mAMs displayed intrinsic heterogeneity in both H3K14ac and MHC-II, consistent with phenotypic plasticity. Mab infection selectively reduced H3K14ac and MHC-II -most prominently in macrophages harboring intracellular bacilli- suggesting pathogen-driven repression of antigen-presenting capacity. To test whether increasing acetylation could counter this program, we applied Panobinostat, a broad HDAC inhibitor, at subclinical, non-cytotoxic concentrations (<100 nM). Panobinostat induced time-dependent gains in H3K14ac and shifted mAMs toward a pro-inflammatory-like state while increasing MHCII abundance. Proteome-wide analysis revealed coordinated metabolic remodeling: contraction of lipid-storage programs with concordant expansion of catabolic/processing pathways, including lysosome, peroxisome, and fatty-acid oxidation. Consistently, lipid-droplet burden measured by confocal microscopy decreased following treatment. Crucially, in Mab-infected mAMs, Panobinostat reversed infection-induced H3K14ac loss and restored MHC-II, particularly within cells carrying intracellular bacteria. This epigenetic rescue was accompanied by diminished lipid accumulation and a measurable restriction of intracellular bacterial growth by colony-forming-unit enumeration, despite Panobinostat lacking direct antimycobacterial activity. These data delineate a tunable epigenetic–metabolic circuit in alveolar macrophages in which HDAC activity couples chromatin state to lipid handling and antigen presentation.',
    },
    {
      title: 'Conclusions',
      description:
        'Given the lipid-rich, inflamed, and infection-prone airway milieu characteristic of CF, our findings suggest that targeted chromatin modulation could complement antibiotics to rebalance macrophage metabolism and enhance antigen presentation in pwCF with Mab disease. More broadly, they highlight H3K14ac dynamics as a mechanistic lever for host-directed intervention against bacterial strategies that suppress immune function without directly targeting the pathogen.',
    },
  ],
  21: [
    {
      title: 'Background and rationale',
      description:
        'Mycobacterium abscessus (Mab) is a rapidly growing nontuberculous mycobacterium associated with several diseases in humans, of which lung disease is the most common as in people with CF. The treatment of this pathogen represents a challenge due to the multi-drug-resistant nature of this species.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The project aims to contrast Mab spread by a two-pronged strategy involving phenotypic medicinal chemistry approaches. In the first strategy we would exploit our in-house library of antimicrobial compounds in search of Hits endowed of anti-Mab activity. The second one will take advantage from High Throughput Screenings (HTSs) already reported in literature, selecting Hit compounds not yet developed by other medicinal chemistry groups. The identified Hit compounds hopefully will be optimized in potent and safe anti-Mab Lead compounds and then preclinical candidates.',
    },
    {
      title: 'Essential methods',
      description:
        'Once anti-Mab Hit compounds will be emerged from the screening against Mab ATCC19977, an iterative cycle of chemical modification/biological evaluation will start with the aim of improve anti-Mab activity, cytotoxicity and ADME-Tox profile to obtain validated Hit compounds ready for studies on clinical isolates (MIC, antibiofilm activity and intracellular activity on THP-1 infected cells).',
    },
    {
      title: 'Preliminary results',
      description:
        'In the first year of research a total of 117 compounds have been tested for anti-Mab activity (MIC) against Mab ATCC19977 strain (11 quinolone drugs, 44 quinolone/quinolone-like compounds, 16 drugs/compounds reported as endowed of anti-Mab activity, 20 drug/drug-like compounds for repurposing approach, 2 newly synthesized M20 analogues, 4 synthesized ID-1 derivatives/intermediates, and 20 niclosamide analogues). 27 compounds have been synthesized (3 quinolone, 4 indenone, and 20 niclosamide analogues) with 3 different synthetic strategies. 8 Hit compounds were identified/confirmed (3 quinolone/quinolone-like compounds, 4 drugs/compounds already reported as endowed of anti-Mab activity, 1 by the repurposing approach). Currently, 4 hit compounds are under evaluation for anti-Mab activity (MIC) against clinical isolates.',
    },
    {
      title: 'Conclusions',
      description:
        'The antibiofilm and intracellular activity we would obtain with the anti-Mab Lead compounds can improve the killing efficacy and reduce the time of treatment with future benefits for Mab infected people with CF.',
    },
  ],
  22: [
    {
      title: 'Background and rationale',
      description:
        'Treating bacterial infections and inflammation remains a top priority for the cystic fibrosis (CF) community, as these are key challenges in people with CF, regardless of the availability of CFTR modulator treatments. Within this area, FFC Ricerca supports studies focused on identifying and validating new antibacterial and anti-inflammatory therapies, which require testing in pre-clinical animal models to advance translational research.',
    },
    {
      title: 'Objectives',
      description:
        'The Cystic Fibrosis animal Core Facility (CFaCore) was established to support research by offering dedicated scientific and regulatory expertise. It provides models within a preclinical platform designed to study pathological processes and evaluate candidate therapeutic molecules aimed at reducing infection or inflammation, thus facilitating the development of new drugs.',
    },
    {
      title: 'Resources and services',
      description:
        'Consolidated experience in research, state-of-the-art infrastructures and innovation capacity are our core values. Our team has developed mouse models for both acute and long-term chronic infections and continues to enhance the CFaCore with new models to meet evolving research needs. We have defined protocols and endpoints to ensure the predictive value and preclinical relevance of drug testing. Specifically, we offer: i) access to pre-clinical models of acute and chronic respiratory infections, utilizing reference and clinical bacterial strains, as well as transgenic cystic fibrosis mice; ii) customized experimental protocols, in-cluding systemic or aerosol pharmacological delivery, tailored to each project’s needs; iii) comprehensive read-outs and data analysis, covering both the pathogen and host response, including lung function measurements. Clear milestones are set for each project to ensure efficient progress toward the overall goal. Our vision is to foster a truly collaborative effort to achieve tangible impacts for the benefit of patients.',
    },
  ],
  23: [
    {
      title: 'Background and rationale',
      description:
        'The Cystic Fibrosis Database (CFDB), active for about fifteen years, is a free web tool that allows healthcare professionals, researchers, and students to evaluate the current scientific evidence on the clinical effectiveness of interventions in cystic fibrosis. The CFDB includes over 1,400 articles: more than 100 Cochrane reviews; approximately 90 other reviews (systematic reviews, HTA reports, and economic analyses); over 1,100 primary studies, including 950 randomized studies; and 80 ongoing studies from major clinical trials registries. CFDB can be very useful for clinicians who wish to understand the effectiveness of interventions (e. g. the best antibiotic regimens, effective anti-inflammatory drugs, CFTR modulators, as well as numerous diagnostic, dietary, physiotherapy, and other interventions). Researchers can quickly consult the state of the art for different areas of cystic fibrosis research (“Topics”), obtaining a powerful and up-to-date synthesis. Patients and their families may also find it of interest although the language used in the scientific literature is not always easily understandable. The database is freely accessible on the website www.cfdb.eu to the entire international scientific community.',
    },
    {
      title: 'Resources and services',
      description:
        'What can we do with CFDB? 1 - Create a query by selecting terms from the search menus (using free text or keywords, by year, or by author). 2 - Select one or more citations and read a structured abstract for each article, including the type of study, participants, interventions, outcomes, results, and conclusions. 3 - Consult fifty up-to-date state-of-the-art summaries on the most relevant topics in cystic fibrosis. Each summary critically presents i) what is known: the current state of evidence, and ii) the unanswered questions: what remains to be clarified by future research. For this reason, CFDB can be considered a concise compendium of evidence-based medicine in cystic fibrosis.',
    },
  ],
  24: [
    {
      title: 'Background and rationale',
      description:
        'The Primary Cell Culture Facility has been active since 2012, established through a collaboration between the Italian Cystic Fibrosis Research Foundation (FFC Ricerca) and the Medical Genetics Laboratory of the Giannina Gaslini Institute. The facility provides researchers with a collection of primary human bronchial epithelial cells (HBECs), obtained from both cystic fibrosis (CF) and non-cystic fibrosis (non-CF) bronchial tissues.',
    },
    {
      title: 'Objectives',
      description:
        'The main goal of the Facility is to offer researchers within the FFC Ricerca network, as well as those supported by CF-related grants, the most relevant biological model of the airway epithelium for studies focusing on: i) the physiology of the airway epithelium and the defects arising from CFTR dysfunction; ii) the evaluation of pharmacological and genetic therapies designed to correct the underlying CF defect; iii) the interactions between bacteria and epithelial cells, as well as the mechanisms driving the inflammatory response.',
    },
    {
      title: 'Resources and services',
      description:
        'The Facility isolates HBECs from explanted bronchi, expands them in culture, and produces large stocks of cryopreserved cell aliquots. Over time, it has built an extensive collection that includes a wide range of CF genotypes and samples from numerous non-CF donors. Frozen aliquots of these cells are available upon request and are supplied together with the specific culture medium required for experimental use. To obtain access, researchers must submit a request form including a brief description of the intended experiments, which allows assessment of their technical feasibility. The Facility also provides its users with: i) a detailed protocol for the correct culture and handling of the supplied cells; ii) the possibility for interested researchers to carry out a period of training at the Facility laboratories; iii) the technical and scientific expertise of Facility staff. Additionally, an Advanced Service is available upon request, offering fully differentiated, ready-to-use epithelial tissues, shipped under refrigerated conditions and embedded in a solid support medium to preserve their integrity.',
    },
  ],
  25: [
    {
      title: 'Background and rationale',
      description:
        'The approval of CFTR modulators (CFTRm) has significantly increased life expectancy for people with cystic fibrosis (pwCF). However, as this population ages, new challenges emerge, including a higher prevalence of gastrointestinal complications. Besides its function as anion channel, CFTR has emerged as a regulator of other key cellular processes, e.g., epithelial differentiation/polarization, regeneration, and epithelial-mesenchymal transition (EMT). We revealed that CFTR loss of function (LoF) in CF epithelia drives active EMT, namely disrupted cell junctions, elevated mesenchymal markers and EMT-transcription factors (TF), impaired wound healing, and lower resilience to pro-in-flammatory stimuli. We found that these changes are mediated by EMT-TF TWIST1 and identified TF YAP1, a master regulator of EMT, as aberrantly active in F508del-CFTR expressing cells. Current CFTRm do not fully revert these defects. Such findings suggest that functional CFTR helps maintain epithelial integrity and, in its absence in CF, regeneration is impaired. However, the molecular mechanism remains unclear.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Our hypothesis is that functional CFTR prevents EMT and that in CF this protective role is lost. The main objective of the project is to advance our mechanistic understanding of how dysfunctional CFTR leads to EMT and impaired regeneration in CF.',
    },
    {
      title: 'Essential methods',
      description:
        'We will analyse primary human airway cells and patient-derived intestinal organoids (PDIOs) by transcriptomics/proteomics to deeply explore cellular and molecular changes. Multi-omics data integration by bioinformatics will identify key pathways, cell trajectories and fate, transcriptional switches, and also novel therapeutic targets.',
    },
    {
      title: 'Preliminary results',
      description:
        'Our preliminary data show that CFBE cells expressing defective, but plasma membrane (PM) located p.Gly551Asp-CFTR have improved junction organization and polarization vs F508del-CFTR cells, in which CFTR does not reach the PM. Hence, EMT progression seems to depend not only on CFTR function but also on its cell surface presence.',
    },
    {
      title: 'Conclusions',
      description:
        'This project will advance the mechanism of how CFTR LoF leads to EMT and deterioration of epithelial integrity. The expected results have the potential to unravel novel strategies for predicting and preventing epithelial dysfunction-related complications in pwCF, like cancer.',
    },
  ],
  26: [
    {
      title: 'Background and rationale',
      description:
        'Cystic fibrosis (CF) arises from CFTR gene mutations; more than 2,000 variants are known. Nonsense (~8%) and splicing (~10%) mutations yield absent or minimal CFTR protein and remain largely unresponsive to current modulators. Antisense oligonucleotides (ASOs) can modulate RNA splicing, stabilize transcripts and restore the reading frame, enabling the production of functional CFTR isoforms.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that ASOs, alone or combined with CFTR modulators such as Kaftrio (elexacaftor/tezacaftor/ivacaftor), can rescue mutant CFTR mRNA and increase functional protein in genotypes with nonsense or splicing defects. Our objectives are to: i) design mutation-directed ASOs; ii) quantify effects on mRNA, protein maturation, and epithelial function; iii) validate lead ASOs in patient-derived airway epithelial preparations in vitro.',
    },
    {
      title: 'Essential methods',
      description:
        'We will design ASOs targeting CFTR pre-mRNA and assess their ability to rescue mutant transcripts and increase CFTR protein expression and function in human airway epithelial cell lines. Candidate ASOs will be tested for specificity to ensure they do not interfere with native CFTR expression. To confirm therapeutic potential, patient-derived human bronchial (HBE) and nasal (HNE) epithelial cells carrying homozygous or heterozygous non-sense or splicing mutations will be used to evaluate the effects of lead ASOs on CFTR-mediated transepithelial ion and fluid transport, as well as key airway surface liquid (ASL) properties, including pH, protein concentration, osmolarity, and viscosity.',
    },
    {
      title: 'Preliminary results',
      description:
        'We designed and tested two ASO pairs targeting exons 19 and 23 of CFTR pre-mRNA, where the R1162X and W1282X nonsense mutations are located. In 16HBEge bronchial epithelial cells harboring these mutations, ASOs drove mutation-specific exon skipping. The resulting transcripts were in-frame and NMD-resistant, yielding mature Δex19 and Δex23 CFTR. Combination with elexacaftor/tezacaftor/ivacaftor further increased mature protein abundance. In differentiated R1162X and W1282X 16HBEge epithelia, ASOs improved CFTR-dependent ion and fluid transport and reduced ASL viscosity.',
    },
    {
      title: 'Conclusions',
      description:
        'ASO-mediated exon skipping emerges as a precision strategy for CF genotypes poorly served by CFTR modulators. This project aims to further develop ASO-based strategies, potentially paving the way for novel therapeutic approaches for CF.',
    },
  ],
  27: [
    {
      title: 'Background and rationale',
      description:
        'Recent advances in genome editing (GE) and delivery methods renew hope for gene therapy in cystic fibrosis (CF), especially for modulator-ineligible (MI) CFTR mutations. Key challenges remain, notably the large size of GE tools limiting delivery efficiency.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that compact GE tools will i) improve packaging into delivery vehicles like lipid nanoparticles (LNPs), and ii) reduce particle size, enhancing delivery to airway epithelial cells (AECs). We aim to develop small base editors for MI CFTR mutations and test novel LNPs for lung delivery. We will compare compact nuclease-derived base editors to standard ones and assess LNP toxicity. This 3-year project has two goals: i) develop GE strategies for undruggable CF mutations (R553X, 1717-1G>T), and ii) study LNP targeting of AECs using advanced lung models.',
    },
    {
      title: 'Essential methods',
      description:
        'We will engineer base editors using small RNA-guided nucleases with broad PAM recognition to improve LNP loading and CFTR targeting. LNP-184, developed by Nava Tx, will be tested for packaging and delivery. We will compare its performance to larger SpCas-ABE editors. Editing efficacy will be evaluated in CF cell lines (HEK293T, 16HBEge-R553X) and primary AECs. To profile LNP-184 targeting, we will use advanced models: i) differentiated CF/non-CF human nasal epithelial (HNE) mono-/co-cultures with lung endothelial cells, and ii) a rat ex vivo lung perfusion (EVLP) model. These models allow mechanistic study of delivery barriers, especially via systemic administration. Inflammation will be monitored post-LNP-184 delivery using pulmonary compliance and scRNAseq to assess early tolerability.',
    },
    {
      title: 'Preliminary results',
      description:
        '1. Nava Tx developed lung-tropic LNPs via in vivo screening in primates. 2. The Cereseto group identified novel GE tools from microbiome metagenomes. 3. Cereseto & Carlon groups achieved efficient base editing of R553X and 1717-1G>A in patient-derived cells. 4. Carlon lab developed translational lung models: HNE mono-/co-cultures and rat EVLP with real-time inflammation monitoring (Ceulemans group).',
    },
    {
      title: 'Conclusions',
      description:
        'We aim to develop compact base editors delivered via lung-tropic LNPs for functional CFTR correction. Specifically, we target GE strategies for undruggable CF mutations and efficient LNP delivery to CF AECs via IV administration.',
    },
  ],
  28: [
    {
      title: 'Background and rationale',
      description:
        'People with cystic fibrosis (CF) with nonsense mutations, also known as premature termination codons (PTCs), are insensitive to drugs (correctors, potentiators) that correct the defect of other CF mutations. There are already several small molecules with the ability to target PTC-associated biological processes, such as the nonsense-mediated RNA decay (NMD) and the translational machinery. It is important to test these agents on different PTCs to find the most effective treatment. We also found evidence that pro-inflammatory stimuli in vitro improve the rescue of CFTR with PTCs.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that the combined modulation of targets having complementary mechanisms of action may result in additive/synergic effects, leading to a substantial rescue of CFTR function, thus correcting the basic defect. Our overall objective is to find optimal pharmacological treatments for each mutation or group of mutations. In this respect, we previously demonstrated that CF-causing PTCs do not respond equally to treatments but require a tailored approach.',
    },
    {
      title: 'Essential methods',
      description:
        'Our project aims at identifying pharmacological treatments to correct the basic defect in people with CF with PTCs. We will use both primary bronchial/nasal epithelia from patients and the 16HBE14o- cell line to test the effect of treatments on CFTR rescue at the functional and protein level. These cell types will also be used to clarify the mechanism of inflammatory cytokines.',
    },
    {
      title: 'Preliminary results',
      description:
        'We recently identified by high-throughput screening three novel NMD inhibitors which can be particularly suited for the rescue of W1282X and other PTCs localized at the terminal region of the CFTR coding sequence. We also found that in vitro pro-inflammatory stimuli amplify the rescue of CFTR with PTCs obtained with pharmacological agents. The study of the underlying effect of cytokines may reveal novel targets for CFTR rescue.',
    },
    {
      title: 'Conclusions',
      description:
        'We anticipate that our results will reveal small molecules, mechanisms, and targets important for the correction of the basic defect in CF patients with PTCs.',
    },
  ],
  29: [
    {
      title: 'Background and rationale',
      description:
        'Cystic fibrosis (CF) is caused by mutations in the CFTR gene, impairing chloride and water transport. CFTR modulators such as Kaftrio (elexacaftor/tezacaftor/ivacaftor) have improved therapy, but only partly restore CFTR function, leaving patients with symptoms and complications. For this reason, new therapeutic strategies are needed. Our group has identified protein kinase D1 (PKD1), a cAMP effector, as a previously unexplored regulator of CFTR trafficking and stability at the plasma membrane, thus indicating PKD1 targeting as a new therapeutic avenue.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that PKD1 is a regulator of CFTR trafficking and stability. The project aims to define how PKD1 controls secretion and membrane stability of mutant CFTR, focusing on F508del and rare class VI mutants, and to validate its functional impact in CF models by testing whether PKD1 activation can boost Kaftrio efficacy in F508del-CFTR and stabilize class VI mutants.',
    },
    {
      title: 'Essential methods',
      description:
        'We will use biochemical assays and live-cell imaging to study PKD1 mechanisms. Functional outcomes will be assessed by YFP-quenching and short-circuit current measurements in Ussing chambers. Experiments will be performed in CF cell lines and in primary airway epithelial cells. PKD1 activation will be induced by a PI3Kγ mimetic peptide.',
    },
    {
      title: 'Preliminary results',
      description:
        'Preliminary data demonstrate that combining Kaftrio with a PI3Kγ mimetic peptide markedly increases the abundance of F508del-CFTR at the plasma membrane compared to Kaftrio alone. This effect translated into functional improvement, since primary airway epithelial cells from patients treated with Kaftrio plus the peptide showed significantly higher chloride currents than those treated with Kaftrio alone. Crucially, when PKD1 activity was pharmacologically inhibited, the increase in membrane expression elicited by the peptide was completely abolished. These findings establish PKD1 as a central player in the regulation of CFTR trafficking and stability and provide a strong basis for the current project.',
    },
    {
      title: 'Conclusions',
      description:
        'This project will clarify the role of PKD1 in CFTR regulation and assess its potential as a therapeutic target. By enhancing Kaftrio efficacy in F508del-CFTR and stabilizing rare class VI mutants, PKD1 activation could broaden the benefits of modulators and lay the basis for future PKD1-targeting therapies.',
    },
  ],
  30: [
    {
      title: 'Background and rationale',
      description:
        'CFTR is an anion channel controlling chloride and bicarbonate transport in epithelial cells. Variants in the CFTR gene cause cystic fibrosis (CF) by impairing channel function through different mechanisms. The most common, F508del, leads to trafficking and gating defects, while mutations such as G551D and G1349D alter channel opening. Impaired ion transport in airways results in thick mucus that traps pathogens, mainly Pseudomonas aeruginosa and Staphylococcus aureus, promoting chronic infection and lung damage. Although CFTR modulators (correctors and potentiators) like Kaftrio have significantly improved lung function, ~15% of patients lack effective therapies, and persistent infections remain a major challenge. We identified frog-skin-derived antimicrobial Esc peptides, Esc(1-21) and its diastereomer Esc(1-21)-1c, which eradicate P. aeruginosa in planktonic and biofilm forms, enhance airway epithelial wound repair, and unexpectedly potentiate the activity of defective CFTR (F508del, G551D), likely via direct channel interaction.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Considering Esc peptides and isoforms as promising dual-function candidates to restore CFTR activity and combat lung infections in CF, the project aims to: i) test their potentiator effect on CFTR gating mutants (especially those refractory to current modulators) and investigate synergy with existing modulators, ii) study their interaction with CFTR to uncover the mechanism of action, and iii) evaluate their antibacterial activity in CF-like lung conditions.',
    },
    {
      title: 'Essential methods',
      description:
        'A multidisciplinary approach combining electrophysiological, biochemical, cell biology and computational methods, as well as mouse models for in vivo studies.',
    },
    {
      title: 'Preliminary results',
      description:
        'We showed that Esc peptides and the alpha-aminoisobutyric acid (Aib) analogue significantly enhance F508del and gating-mutant CFTR activity, likely by stabilizing the open state of the channel. Cross-linking experiments confirmed peptide binding at predicted sites in the nucleotide-binding domains of CFTR. The Aib analogue was also found to be active against S. aureus without cytotoxicity. Both Esc(1-21)-1c and this analogue outperformed colistin in CF-like mouse lungs.',
    },
    {
      title: 'Conclusions',
      description:
        'While therapies like Kaftrio and ivacaftor improve outcomes for many patients, some mutations remain resistant, leaving individuals with no effective options. We expect to identify the best combined therapy based on Esc peptides and CFTR modulators, to restore CFTR function and treat P. aeruginosa/S. aureus infections, thereby improving outcomes and quality of life of people with CF through airway administration.',
    },
  ],
  31: [
    {
      title: 'Background and rationale',
      description:
        'The survival rate of people with cystic fibrosis (CF) has increased considerably with the introduction of modulator therapies for a subset of cystic fibrosis transmembrane regulator (CFTR) mutations. However, airway infections remain a major challenge for people with CF. The CF lung hosts complex microbial communities, and lifelong antibiotic treatments drive the emergence of multidrug-resistant (MDR) pathogens, severely limiting current therapeutic options.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Conventional antibiotics are derived from microbial products for which resistance mechanisms have already spread in nature. In contrast, xenobiotic agents, as Peptide Nucleic Acids (PNAs), are unlikely to encounter pre-existing resistance mechanisms. PNAs are DNA mimics that stably interact with complementary RNA, thereby preventing their translation. PNAs resist enzymatic degradation and evade existing resistance mechanisms, constituting promising antimicrobial candidates. On this basis, this project aims to develop broad-spectrum PNAs targeting conserved essential genes shared by CF pathogens.',
    },
    {
      title: 'Essential methods',
      description:
        'Over three years, this project will pursue the proposed objective by: i) in silico identification of “universal” targets through comparative genomic analysis of CF pathogens; ii) design of PNAs based on the results of in silico analyses, and screening through in vitro transcription/translation assays; iii) conjugation of selected PNAs with Cell Penetrating Peptides (CPP) to enhance uptake into bacterial cells, and validation of CPP-PNAs broad-spectrum anti-bacterial activity by using standard assays (e.g. MIC, MBC, biofilm formation); iv) evaluation of CPP-PNAs toxicity in pulmonary epithelial cell lines; v) in vivo validation of their efficacy in a mouse model of lung infection.',
    },
    {
      title: 'Preliminary results',
      description:
        'CPP-conjugated PNAs targeting essential prokaryotic RNAs have already shown potent antibacterial activity against several bacteria, including CF pathogens. The PI has previously contributed to a project aimed at developing broad-spectrum PNAs against multiple MDR pathogens, identifying candidates with promising antibacterial activity.',
    },
    {
      title: 'Conclusions',
      description:
        'The project has the potential to deliver CPP-PNAs with antimicrobial activity against multiple CF pathogens, paving the way for candidates suitable for future clinical trials.',
    },
  ],
  32: [
    {
      title: 'Background and rationale',
      description:
        'The ability of Pseudomonas aeruginosa to thrive in the lungs of people with cystic fibrosis (CF) is dependent on its noteworthy ability to acquire zinc (Zn) and evade the immune responses that limit accessibility to this metal. This capability depends on the secretion of zincophores of the opine family, which scavenge Zn from the extracellular environment. Such a mechanism of Zn uptake offers possibilities to exploit a “Trojan horse” strategy to enhance antibiotic delivery, overcoming key resistance mechanisms in CF pathogens.',
    },
    {
      title: 'Objectives',
      description:
        'This project aims to characterize Aztreopine, an Aztreonam-zincophore conjugate developed in a recent FFC Ricerca pilot study and assess its preclinical efficacy. Additionally, we will apply the same Trojan horse approach to develop new antibiotic-zincophore conjugates against P. aeruginosa.',
    },
    {
      title: 'Essential methods',
      description:
        'We will validate Aztreopine as an effective antimicrobial for P. aeruginosa infections by optimizing its synthesis and testing its efficacy against clinical isolates, including Aztreonam-resistant strains. We will assess ZrmA receptor conservation in CF isolates and evaluate cytotoxicity in human lung epithelial cells. Preclinical efficacy will be validated in mouse lung infection models. Additionally, we will expand this strategy by generating novel Trojan horse antibiotics targeting P. aeruginosa, by conjugating additional antibiotics to the same zincophore moiety used for the synthesis of Aztreopine.',
    },
    {
      title: 'Preliminary results',
      description:
        'Pilot studies identified Zn uptake as a drug delivery target. We synthesized Aztreopine, a conjugate of Aztreonam with a simplified form of the zincophore pseudopaline. It showed strong activity against P. aeruginosa in Zn-limited conditions, outperforming Aztreonam alone. The specificity of the drug was demonstrated by its ineffectiveness against mutants defective in the zincophore receptor. Aztreopine also reduced biofilm formation and exhibited efficacy in Galleria mellonella.',
    },
    {
      title: 'Conclusions',
      description:
        'Targeting Zn acquisition presents a promising strategy to combat resistance, offering pathogen-specific treatments with reduced toxicity and enhanced efficacy. This project will provide preclinical validation of Aztreopin and yield new Trojan horse antibiotics against resistant P. aeruginosa',
    },
  ],
  33: [
    {
      title: 'Background and rationale',
      description:
        'Pseudomonas aeruginosa lung infection contributes to progressive lung damage in people with cystic fibrosis (CF). Antibiotic resistance and biofilm-associated persistence of P. aeruginosa limit the efficacy of antibiotic therapies. Antivirulence strategies offer an alternative treatment option, targeting bacterial virulence rather than growth, reducing selective pressure for resistance, and enhancing host immune clearance. Recent studies have identified the intracellular signaling molecule diadenosine tetraphosphate (Ap4A) as a key regulator of P. aeruginosa virulence, with the Ap4A hydrolase ApaH playing a central role in this pathway.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The rationale of the project is that pharmacological inhibition of ApaH can significantly reduce P. aeruginosa virulence, providing a new strategy to treat lung infections in CF in-dividuals. The main objectives are i) characterization of druggable sites on ApaH, ii) identification of putative ApaH-targeting compounds, and iii) in vitro and in vivo validation of ApaH inhibitors.',
    },
    {
      title: 'Essential methods',
      description:
        'Molecular docking, site-specific mutagenesis, and fragment-based crystal screening will be carried out to identify and characterize ApaH druggable sites. Structure-based virtual screenings will be performed to identify potential inhibitors of ApaH. Biochemical assays and virulence factor analysis in P. aeruginosa reference and CF strains will be conducted to validate the putative ApaH inhibitors both in vitro and in vivo.',
    },
    {
      title: 'Preliminary results',
      description:
        "Recently, we demonstrated that ApaH inactivation leads to a drastic reduction in the expression of key virulence traits in both reference and CF strains, significantly impairing P. aeruginosa's ability to cause infection in different experimental models. We also performed a structural characterization of ApaH, providing a foundation for inhibitor design. Additionally, we developed enzymatic and virulence assays for testing potential ApaH inhibitors.",
    },
    {
      title: 'Conclusions',
      description:
        'In this one-year project, we aim to identify small molecules that inhibit ApaH and attenuate P. aeruginosa virulence. These compounds will constitute the first in vivo validated inhibitors of ApaH and will serve as lead molecules for further optimization and/or preclinical evaluation.',
    },
  ],
  34: [
    {
      title: 'Background and rationale',
      description:
        'CFTR modulators, including Kaftrio, have improved survival in people with cystic fibrosis (pwCF) but cannot reverse established lung damage, leaving respiratory infections and inflammation unresolved. Reduced sputum production further limits the timely detection of pathogens. There is a need for innovative, non-invasive strategies to monitor infections. Emerging evidence points to a gut–lung axis in CF, with the gastrointestinal tract potentially serving as a reservoir for bacteria relevant to airway disease.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that fecal samples from pwCF may contain bacterial pathogens also pre-sent in the lungs, and could serve as a surrogate for airway infection diagnosis. The objective is to test whether fecal analysis provides a simple, reliable, and non-invasive tool for detecting and monitoring lung infections, particularly in pwCF treated with Kaftrio.',
    },
    {
      title: 'Essential methods',
      description:
        'Three groups will be enrolled: i) pwCF chronically colonized by Pseudomonas aeruginosa and not on modulators, ii) pwCF never colonized by P. aeruginosa and not on modulators (negative controls), iii) P. aeruginosa–colonized pwCF on Kaftrio. Respiratory (sputum, oropharyngeal swab, induced sputum) and fecal samples will be collected in parallel. Pathogens will be identified by culture and, when negative, by shotgun metagenomic sequencing. Strain relatedness between fecal and respiratory isolates will be assessed. Particular attention will be given to P. aeruginosa, the main pathogen guiding pwCF stratification, on which phenotypic traits such as biofilm formation, virulence, and antibiotic susceptibility will be primarily assessed. Other CF-relevant bacteria will also be monitored.',
    },
    {
      title: 'Preliminary results',
      description:
        'In CF mouse models, gut barrier dysfunction, enteric bacterial overgrowth, and shared lung–gut microbiota were observed. Pilot data in pwCF showed identical bacterial strains in fecal and sputum samples, supporting the feasibility of gut–lung crosstalk analyses.',
    },
    {
      title: 'Conclusions',
      description:
        'This project will establish whether feces can serve as a non-invasive surrogate for monitoring respiratory infections. Expected results include improved early detection of P. aeruginosa and other pathogens, providing insights into host–microbe dynamics in CF. In the long term, this approach could enhance infection surveillance, guide personalized therapy, and improve quality of life.',
    },
  ],
  35: [
    {
      title: 'Background and rationale',
      description:
        'Mycobacterium abscessus (Mab) is an opportunistic pathogen intrinsically resistant to most antibiotics, frequently linked to chronic pulmonary infections in people with cystic fibrosis (pwCF). We have previously described bioactive liposomes as a novel host-directed therapeutic tool able to enhance macrophages’ antimicrobial response, leading to intracellular killing of multidrug-resistant (MDR) bacterial pathogens, while limiting inflammatory response. Recently, bioactive liposomes composed of phosphatidylserine (PS) and phosphatidic acid (PA), effective against in vitro Mab infections, have been optimized via microfluidics technique (PSPA-M liposomes) in terms of homogeneity, stability and scaling up properties.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'To develop PSPA-M liposome formulation, encapsulating Amikacin (PSPA-M/AMK), Clarithromycin (PSPA-M/CLR) or Azithromycin (PSPA-M/AZM), to combine the host-directed action, exerted by liposomes, with the pathogen-directed action, exerted by antibiotics, in a single, more active therapeutic formulation.',
    },
    {
      title: 'Essential methods',
      description:
        'PSPA-M formulation was generated by microfluidics technique and characterized in terms of z-potential, size and polydispersity index, immediately after its production by using Zeta-Sizer. Possible PSPA-M cytotoxic effects were tested by cell viability assay on monocytes from healthy donor (HD) induced to differentiate into either type 1 (M1) or type 2 (M2) macrophages, both at 18 hours and 5 days after stimulation. Finally, both M1 and M2 from HD and primary macrophages derived by pwCF were in vitro infected with Mab and stimulated with PSPA-M for 18h. Treatment efficacy was assessed in terms of intracellular mycobacterial killing by CFU assay.',
    },
    {
      title: 'Preliminary results',
      description:
        'PSPA-M liposomes are homogeneous and stable, do not induce any in vitro toxic effects and enhance intracellular bacterial killing in both M1 and M2 macrophages from HD and pwCF in vitro infected with Mab.',
    },
    {
      title: 'Conclusions',
      description:
        'Development of a combined host- and pathogen-directed therapeutic strategy based on PSPA-M liposome encapsulating antibiotics that may i) specifically target intracellular pathogens in the lung, ii) improve the therapy regimen, and iii) reduce the antibiotic time of therapy with its related toxicity, for a better control of pulmonary MDR (myco)bacterial infections in pwCF.',
    },
  ],
  36: [
    {
      title: 'Background and rationale',
      description:
        'Mycobacterium abscessus (Mab) is the most common nontuberculous mycobacterium species isolated in persons with cystic fibrosis (CF). Multidrug therapy for Mab infections is very long and frequently unsuccessful. Dormant and persistent cells are responsible for treatment failures and chronicity of the infection. Dormants arise from thick biofilm layers, whereas drug-resistant persisters are formed stochastically within Mab populations. Both forms are hard to eradicate.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'To combat Mab infections in CF, we need to address how these subpopulations are formed and survive killing doses of drugs in culture, in biofilm and inside host cells. The objective of this project is to identify specific genes responsible for persister formation, to study these genes in different conditions, and to test which drugs are active on these forms in the different conditions mentioned. Moreover, the generation of knock-out strains of genes up-regulated in persisters will shed light on mechanisms of persistence.',
    },
    {
      title: 'Essential methods',
      description:
        'Mab ATCC 19977 strain is used in all experiments. All drugs are used at their maximum drug concentration (Cmax). RNA is extracted using a combination of cell disruption and kit purification and analyzed by qRT-PCR. Mab biofilm will be produced in 96-well MBEC Innovotech MBEC 96-well Assay Plates. Monocyte-derived macrophages and A549 human alveolar epithelial cells will be grown and used for Mab infection studies.',
    },
    {
      title: 'Preliminary results',
      description:
        'We have performed RNAseq on Mab incubated with bedaquilin+amikacin (Bq+Ak), a combination that kills replicating bacteria, and compared gene expression to the untreated control. Overall, up to 250 genes were highly differentially expressed. Among these, we observed transcription factors, toxins/antitoxins, and anti-oxidative stress response genes. Some genes were strongly upregulated with Bq+Ak and activated in persisters generated with different drug combinations. We also tested some drug associations on Mab persisters with some promising results. RNA extracted from biofilm Mab cultures showed the activation of dormancy-related genes when compared to replicating Mab.',
    },
    {
      title: 'Conclusions',
      description:
        'Finding new targets for drug development and new strategies in the therapy of Mab in-fections in CF is the main purpose of the project. Shortening the therapy, introducing the ability to kill dormant and persister cells will definitely improve the quality of life of people with CF.',
    },
  ],
  37: [
    {
      title: 'Background and rationale',
      description:
        'People with cystic fibrosis (pwCF) are at high risk of developing serious lung infections, including those caused by NonTuberculous Mycobacteria (NTM). These bacteria can cause chronic lung disease, particularly in individuals with pre-existing lung problems. While new CF treatments have improved health outcomes, some patients still struggle with persistent infections, and others cannot access these treatments. Further, treatments for NTM are often unsuccessful and carry several side effects.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study aims to understand how the immune system of people with CF responds to NTM infections compared to those without CF. Researchers believe that pwCF have a unique immune response that may influence how the disease progresses. The study will focus on two main goals: i) identifying differences in immune system activation between CF and non-CF individuals with NTM infections; ii) examining how CF lung cells react when infected with NTM compared to non-CF lung cells.',
    },
    {
      title: 'Essential methods',
      description:
        'This research will use advanced techniques (scRNAseq and in vitro models with human primary cells) to analyze immune cells and lung tissues to uncover key differences between CF and non-CF responses to NTM.',
    },
    {
      title: 'Preliminary results',
      description:
        'Early findings suggest that people with CF have an overactive immune response to NTM, which might contribute to lung inflammation and damage.',
    },
    {
      title: 'Conclusions',
      description:
        'The expected results could help identify markers of infection severity, leading to more personalized treatments. Ultimately, this work supports the mission of the Italian Cystic Fibrosis Research Foundation by improving our understanding of CF-related lung infections thus guiding the development of better treatments for those who do not benefit from existing therapies.',
    },
  ],
  38: [
    {
      title: 'Background and rationale',
      description:
        'Mycobacterium abscessus poses a major clinical challenge due to its extensive antibiotic resistance and intracellular persistence, especially in people with cystic fibrosis (CF). Bacteriophages represent a promising solution for treating infections caused by mycobacteria.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This study aimed to characterize the ex vivo activity of Pisa4, a novel mycobacteriophage isolated using the non-pathogen Mycobacterium smegmatis mc²155 as host, as well as to gene-tically modify it in order to confer a strictly lytic phenotype, needed for clinical applications.',
    },
    {
      title: 'Essential methods',
      description:
        'Ex vivo infection models were established using THP-1 macrophages and primary human neutrophils, and phage activity was analysed by bacterial plating, plaque assay and confocal laser scanning microscopy. Phage engineering was performed via the bacteriophage recombineering method with electroporated DNA.',
    },
    {
      title: 'Preliminary results',
      description:
        'Among the mycobacteriophages of our phage library, Pisa4 was selected for its favourable characteristics for potential clinical applications, including the absence of known virulence and antibiotic resistance genes, rapid replication, high burst size, and stability under acidic conditions mimicking the phagosomal environment. Co-incubation of Pisa4 with M. smegmatis significantly increased intracellular phage particles in THP-1 cells observed by high-resolution imaging, which confirmed phage entry and co-localization with bacteria. However, post-infection treatment was ineffective, even though phages co-localized with the bacteria, likely due to bacterial metabolic reprogramming affecting phage replication. Notably, Pisa4 did not trigger neutrophil extracellular trap release by primary human neutrophils, indicating a favourable safety profile, particularly in the context of pathological conditions characterized by hyperinflammation, such as in CF. Activity against M. abscessus clinical isolates was observed in 8/49 strains, consistent with the narrow host range of mycobacteriophages. Molecular analysis of Pisa4 mutant phage confirmed the deletion of the immunity repressor gene, responsible for the establishment of the lysogenic cycle, conferring a strictly lytic phenotype.',
    },
    {
      title: 'Conclusions',
      description:
        'These findings support Pisa4 as a promising candidate against susceptible mycobacteria, with ongoing studies exploring engineered phage efficacy and host immune responses. The strictly lytic Pisa4 phage might be applied in compassionate use to treat people with CF infected with Mab, after magistral preparation and ethics committee approval.',
    },
  ],
  39: [
    {
      title: 'Background and rationale',
      description:
        'This project is part of ongoing research with the final goal of making phage therapy a practicable option to cure the Pseudomonas aeruginosa (Pa) pulmonary infection in people with cystic fibrosis (CF). Since phages are extremely specific for their bacterial hosts, phage therapy requires a personalized approach, tailored to the susceptibility of the infecting bacterial strain to specific phages.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The specific aims of this project are: i) to develop a collection of phages able to kill Pa CF isolates, which are frequently multi-phage resistant; ii) to assess whether Pa infections in patients treated with Kaftrio could be cured by the same phages active against isolates from untreated patients or require specific phages; iii) to understand mechanism determining phage resistance in CF isolates.',
    },
    {
      title: 'Essential methods',
      description:
        'To reach the above aims, we have i) profiled phage susceptibility of Pa strains isolated before and at different times after the initiation of Kaftrio therapy; ii) characterized natural phages to assess their suitability for phage therapy; iii) modified the host range of natural phages through random approaches like UV mutagenesis and in vitro evolution; and iv) characterized new phage cocktails in vitro and in vivo, in a zebrafish model of Pa infection.',
    },
    {
      title: 'Results',
      description:
        'The results obtained in the project are as follows: i) no correlation was found between the months of treatment with Kaftrio and the susceptibility to phages of new isolates from people with CF; ii) five phages potentially suitable for phage therapy have been identified through genomic and phenotypic characterization. Moreover, the mechanism of adsorption of DEV, a component of phage cocktails for phage therapy; has been clarified; iii) both UV mutagenesis of DEV phage and in vitro evolution of a two-phage cocktail confirmed to be effective in broadening phage host range towards CF clinical isolates.',
    },
    {
      title: 'Conclusions',
      description:
        'With only a few months left before the project ends, we can say that we have achieved the main goal of obtaining phages with a relatively broad host range against clinical Pa strains.',
    },
  ],
  40: [
    {
      title: 'Background and rationale',
      description:
        'Colonization by Pseudomonas aeruginosa (Pa) drives the establishment of persistent biofilm infections in the lower airways of people with cystic fibrosis (pwCF). Yet, there is still a lack of standardized models capable of reproducing the features of in vivo mature biofilm. Most available in vitro models rely on abiotic surfaces and therefore provide limited translational relevance.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This three-year project is embedded within a broader research effort to advance phage therapy as a therapeutic strategy for antibiotic-refractory Pa chronic lung infections in pwCF. In this perspective, there is a critical need for biofilm models that reliably recapitulate the physicochemical conditions of CF airways and support the development of clinically meaningful biofilm structures.',
    },
    {
      title: 'Essential methods',
      description:
        'We established the ex vivo pig lung (EVPL) CF model, designed to mimic the environment of human CF airways. Swine bronchial tissue is incubated with artificial sputum medium reproducing the composition of CF airway secretions and subsequently challenged with a panel of Pa strains (both laboratory and clinical), allowing the growth of an extensive and thick in vivo-like biofilm. The anti-biofilm potential of phage preparations is then assessed through quantitative biomass measurements and qualitative microscopy analyses.',
    },
    {
      title: 'Preliminary results',
      description:
        'In previous projects, we isolated and characterized phages specific for Pa. In the EVPL model, phage treatment almost completely eradicated biofilms formed by laboratory strains, as demonstrated by a marked reduction in bacterial biomass. Phages also showed synergistic effects with commonly used antibiotics. In particular, combined treatment eradicated biofilms generated by clinical isolates from pwCF, regardless of Kaftrio therapy status. Our findings indicate that the efficacy of mono versus multi-phage formulations can vary depending on the specific Pa strain. Finally, phage treatment disrupted biofilm architecture and strongly inhibited matrix production.',
    },
    {
      title: 'Conclusions',
      description:
        'The study underscores the potential of the EVPL CF model as a robust tool for assessing the activity of phages against Pa biofilms. Given the persistence of Pa, the development of effective phage-based strategies holds strong clinical relevance for pwCF. Furthermore, the implementation of this cost-effective, easy-to-use CF biofilm model may help accelerate the introduction of phage therapy towards clinical application.',
    },
  ],
  41: [
    {
      title: 'Background and rationale',
      description:
        'Despite being a widespread global disease, ABPA still lacks a clear understanding of pathogenesis, which limits the ability to be diagnosed and hinders the development of therapeutic strategies. Current treatments focus on reducing Th2 immunological response using corticosteroids and lowering fungal burden with the use of antifungal agents. Unfortunately, even if treated, many patients still suffer from active disease or frequent exacerbation, which poses a further health burden on patients who are often already compromised. In addition, existing therapies focus only on treating symptoms of ABPA, which forces therapies to always be reactionary, as ABPA lacks clear biological markers to predict the development and progression of the disease.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'By understanding how the cytokine pattern may affect isotype switch, we are identifying the induction of non-beneficial IgE responses depending on the type of cell immunity and therefore the cytokine microenvironment. Our interest is also focused on anti-fungal IgG with known anti-inflammatory role, also acting as a non-anaphylactic or “blocking immunoglobulin” against non-beneficial IgE responses. Pivotal, the role of IL-17F in shaping the IgE switch is investigated here. Our objectives are: i) to understand the kinetics and determine the titres of the human antibody repertoires against Aspergillus in ABPA; ii) to identify different cytokine patterns, which are known to correlate with Ig enhancement and disease severity and remission; iii) to investigate which cytokine pattern can shape the protective or non-protective anti-fungal Ig subclasses.',
    },
    {
      title: 'Essential methods',
      description:
        'The titres of antigen-specific/total IgG subclasses and IgE are first determined at different stages of ABPA in people with cystic fibrosis (CF) coming from three different centres. In parallel, we are determining the cytokine pattern induced to understand the main cells involved in IgE switching. In vitro organoid model and mouse model of ABPA help with results validation.',
    },
    {
      title: 'Results',
      description:
        'IL-17F was found to be increased in ABPA patients while barely detectible in cystic fibrosis and sensitized patients, and it is positively correlated to both specific anti-Aspergillus IgE and total serum IgE. IL-17F and IL-22 are detected when B and T cells directly interact, and B cells produce IL-23 via Dectin-1 and Aspergillus recognition.',
    },
    {
      title: 'Conclusions',
      description:
        'This peculiar IL-17F-IL-22-IL-23 cytokine signature characterizes ABPA patients compared to non-ABPA patients. The B-T cell synapse is the key to better understanding the immunological function in determining the lung remodelling and the goblet metaplasia that deteriorate the lung function in CF upon Aspergillus sensitization. The same mechanism may be applied to other pathogens able to activate in a direct way, B cells and Dectin-1.',
    },
  ],
  42: [
    {
      title: 'Background and rationale',
      description:
        'The increase in resistance to antibiotics, together with the delay in discovering new anti-bacterials, is drastically limiting our ability to fight pathogenic bacteria. The development of molecules with anti-virulence effects and/or capable of resensitizing resistant strains to antibiotics is an emerging approach that can produce targeted antibacterial therapies in cystic fibrosis. From this perspective, bacterial small RNAs represent an unexploited category of therapeutic targets. Our focus is on the small RNA ErsA of the pulmonary pathogen Pseudomonas aeruginosa, due to its role in regulating functions associated with lung pathogenesis and antibiotic resistance. Specifically, we previously found that the deletion of ErsA i) induces resensitization to ceftazidime, cefepime, and meropenem in the multidrug-resistant clinical strain RP73 and ii) strongly attenuates the laboratory strain PAO1 in a mouse model of infection. Anti-ErsA molecules are expected to be precursors of multi-functional drugs with antivirulence and antibiotic adjuvant activity at the same time.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'In previous projects funded by FFC Ricerca, we designed and tested a collection of anti-ErsA PNA oligomers that could bind to ErsA and prevent its regulatory function. In particular, we found that four anti-ErsA PNAs in our collection were remarkably effective in re-sensitizing the clinical strain RP73 to meropenem at micromolar concentrations. This project aimed to optimize the efficacy of these anti-ErsA PNAs through in vitro studies and to evaluate their potential for use in vivo in a preclinical murine infection model.',
    },
    {
      title: 'Essential methods',
      description:
        'We used well-established protocols to assess the efficacy of antibiotic activity in vitro and a mouse model of acute lung infection to assay anti-ErsA PNAs in vivo.',
    },
    {
      title: 'Preliminary results',
      description:
        'We have developed a pipeline to optimize the use of anti-ErsA PNAs to increase the effectiveness of meropenem on cultured bacterial cells and also tested the emergence of bacterial variants evading the resensitizing activity of the anti-ErsA PNAs. We are currently conducting studies on the efficacy of anti-ErsA PNAs as adjuvants to meropenem in a mouse model of acute infection, testing micromolar concentrations, which we previously used in vitro.',
    },
    {
      title: 'Conclusions',
      description:
        'Overall, we expect to provide innovative molecules for further use as anti-Pseudomonas drugs in combination with antibiotic therapies currently used in cystic fibrosis.',
    },
  ],
  43: [
    {
      title: 'Background and rationale',
      description:
        'Chronic respiratory infections caused by Pseudomonas aeruginosa are among the leading contributors to morbidity and mortality in people with cystic fibrosis (CF). The bacterium’s ability to form biofilms and produce a wide range of virulence factors enables it to withstand both antibiotics and host immune defenses. A critical regulator of these processes is quorum sensing (QS), which coordinates the development of biofilms and the expression of virulence.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This project aims to discover novel quinazoline-based antivirulence compounds that target PqsR, a key regulator in P. aeruginosa quorum sensing. PqsR plays a central role in controlling virulence and is the most prevalent QS regulator identified in clinical isolates from people with CF. The goal is to identify clinically relevant compounds with potential efficacy against CF-associated infections.',
    },
    {
      title: 'Essential methods',
      description:
        'Methods used for addressing the expected goals can be divided into: i) medicinal chemistry: computer-aided drug design, synthesis of libraries of PqsR modulators, in silico prediction of drug-like properties, structure-activity relationship studies; ii) microbiology: assays for determination of biofilm formation and production of virulence factors (pyocyanin, pyoverdine) in P. aeruginosa strains (RP73 and BJ3525) under both “classical” and CF-like conditions.',
    },
    {
      title: 'Preliminary results',
      description:
        'Virtual libraries were generated through side chain hopping, exploring various modifications of the quinazolinone scaffold. Docking, clustering, and property analyses guided the prioritization of compounds for synthesis. The libraries were then assembled using a convergent synthetic approach. To investigate antivirulence activity, assay conditions were carefully optimized. A set of compounds was identified able to significantly reduce pyocyanin production in a strain-independent manner. Moreover, some compounds significantly affected biofilm formation by P. aeruginosa RP73 strain under classic conditions, and by both P. aeruginosa strains under CF-like conditions, showing high potential for strain- and settings-independent effectiveness.',
    },
    {
      title: 'Conclusions',
      description:
        'The synthesis and characterization of novel antivirulence compounds targeting PqsR has been accomplished, and valuable information has been collected that will drive the subsequent phases of the project.',
    },
  ],
  44: [
    {
      title: 'Background and rationale',
      description:
        'Staphylococcus aureus (Sa) and Pseudomonas aeruginosa (Pa) are the two highly prevalent pathogens in people with cystic fibrosis (pwCF). Interactions among these organisms seem to profoundly impact their persistence and virulence, resulting in enhanced resistance to antibiotics. Therefore, the identification of novel agents able to control polymicrobial infections represents a compelling need in CF drug discovery.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Our previous investigations (FFC#23/2018, #20/2019 and #13/2020) enable us to select two lead compounds, L-IM15 and L-IM16, among the class of iminosugars (glycomimetics). Both compounds exhibited anti-inflammatory and antibacterial activity in mouse models of Pa acute and chronic infections. L-IM16 was also able to inhibit the growth and biofilm formation of Sa and of other CF-relevant pathogens. In-depth studies suggested that they could act as an anti-virulence (L-IM15) and as a classical antimicrobial agent (L-IM16). Our aim, herein, is to evaluate their efficacy in models of Pa-Sa co-infections that mimic the conditions of pwCF. Exploiting their different mechanisms of action, the effect of the combined administration of L-IM15 and L-IM16, on both mono- and co-infection models will be evaluated in search of an additive or synergistic anti-infective effect.',
    },
    {
      title: 'Essential methods',
      description:
        'L-IM15 and L-IM16 have been synthesized with an eco-friendly and scalable procedure. In vitro antibacterial and antibiofilm activity were evaluated by broth microdilution and crystal violet biofilm staining methods, respectively. Murine models of acute Pa and Sa monoinfections were used to evaluate the efficacy and the most suitable administration route.',
    },
    {
      title: 'Preliminary results',
      description:
        'During this first year of activity, L-IM15 and L-IM16 have been successfully prepared at a multigram scale. Early in vitro studies focused on the effect of the combination of L-IM15 and L-IM16, which revealed a reduction in bacterial growth and biofilm formation in Pa and Sa strains. Preliminary in vivo tests indicated: i) oral administration as the most suitable route of administration for both compounds, and ii) promising antibacterial and anti-in-flammatory activity for both molecules in acute Sa infection models.',
    },
    {
      title: 'Conclusions',
      description:
        'In vivo assays are currently ongoing to assess the efficacy of the combined administration of L-IM15 and L-IM16, on both mono- and co-infection models, while proteomic studies and other microbiological assays will be exploited to deeper evaluate the antimicrobial activity and elucidate the mechanism of action of these iminosugars.',
    },
  ],
  45: [
    {
      title: 'Background and rationale',
      description:
        "Pseudomonas aeruginosa (Pa) causes chronic lung infections in people with cystic fibrosis (CF). During its adaptation to the CF lung, Pa undergoes changes allowing antibiotic resistance and immune system evasion. How these modifications relate to the patient's clinical course over time, drug therapies administered, and existing bacterial co-colonization remains unclear. In addition, the impact that modulator therapies have on CF lung microbiology remains to be elucidated.",
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'This project aims to study how Pa adapts over the years of lung colonisation and how it responds to modulators, to personalise treatment and predict disease outcomes based on the characteristics of colonising strains.',
    },
    {
      title: 'Essential methods',
      description:
        'We began to investigate, by Whole Genome Sequencing, changes over time in the resistome and virulome of 620 isolates collected and stored for up to 20 years from 62 CF patients. We also began to compare genetic and phenotypic data on resistance and virulence by examining antibiotic sensitivity and the capacity of 145 selected Pa strains to form biofilm, move, and produce compounds that cause lung damage.',
    },
    {
      title: 'Preliminary results',
      description:
        'Our initial data provide an overview of the circulating clones in the patient cohort, including the dynamics between co-infecting clones and their potential negative impact on pro-gnosis. Several patients have been observed to show the initial ST evolving into clonal complexes in response to challenging events such as transplantation or modulator start, as part of an ongoing evolution. Data also reveal probable cross-infection events between patients that spread the high-risk clone (HRC) ST274 and a new epidemic clone, ST3243. Resistance was a predominant feature among the 620 Pa isolates, mostly supported by chromosomal mutations. Preliminary phenotypic virulence investigation showed the inability of ST3243 to produce biofilm and exhibit swarming motility in any tested condition, even when mimicking the CF lung environment, whereas ST274 displayed high strain-specific variability in biofilm formation. Production of oxidative stress-related molecules was generally low. The effect of different modulators was preliminary seen in 35 patients and ranged from the acquisition of new clones (also HRC) to the adaptation and persistence of colonising ones.',
    },
    {
      title: 'Conclusions',
      description:
        'Extending these data will allow the design of personalized therapy, tailored to patients according to the characteristics of the bacterial colonizing strain, and to understand in detail the effect of modulators on bacteria.',
    },
  ],
  46: [
    {
      title: 'Background and rationale',
      description:
        'Pseudomonas aeruginosa and Staphylococcus aureus can cause chronic infections in adults and children with cystic fibrosis (CF), and they are particularly difficult to treat due to their multidrug resistance (MDR). To promote innovative treatments and care for CF, we applied an innovative approach, the Virtual Screening (VS), to identify bactericidal molecules with a mechanism of action different from that in clinical use, i.e. targeting proteins involved in cell division.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We applied the VS approach to proteins involved in cell division, which are essential for bacterial survival, i.e. FtsZ, and the complex FtsA-FtsN, to find new molecules able to block P. aeruginosa and S. aureus growth.',
    },
    {
      title: 'Essential methods',
      description:
        'The VS provides a fast and cheap method for the selection of small molecules predicted to be effective in the inhibition of the selected enzymes. After identifying the molecules, we evaluated their activity on the target proteins and their efficacy in inhibiting bacterial growth, as well as the ability of bacteria to form biofilms. The compound showing the best properties will be tested in vivo in a mouse model of infection.',
    },
    {
      title: 'Preliminary results',
      description:
        'The VS on FtsZ led to the identification of the compound C11 with antimicrobial activity against S. aureus, CF clinical isolates, MRSA, a very low toxicity and synergy with other antibiotics. Its efficacy is going to be tested in vivo in a mouse model of S. aureus infection. The VS approach on the essential cell division proteins of P. aeruginosa, FtsA and FtsN, led to the identification of 9 molecules. Six of these are able to impair the FtsA/N interaction in vitro, but are not effective in inhibiting P. aeruginosa growth, so further chemical optimization will be necessary to improve their activity.',
    },
    {
      title: 'Conclusions',
      description:
        'The reported results indicate that the C11 compound is a promising drug candidate with great potential against S. aureus infections, including MDR strains, while the compounds targeting FtsA-FtsN need further chemical optimization in order to inhibit P. aeruginosa growth. In summary, the VS approach is a valuable method to find new therapeutic solutions for CF airway pathogens, thus promoting the introduction of innovative treatments.',
    },
  ],
  47: [
    {
      title: 'Background and rationale',
      description:
        'Biofilm formation and the development of bacterial persisters, even the viable but non-culturable (VBNC) cells, hamper the eradication of the cystic fibrosis (CF) lung in-fections caused by Pseudomonas aeruginosa. The activity of cefiderocol (CFD), exploiting the bacterial iron uptake systems to enter the cell and achieve a high bactericidal effect, against these specialized phenotypes has been investigated only in limited studies, lacking the detection of the VBNC forms.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'To evaluate the CFD antipersister activity, this project’s aims are: i) investigating the P. aeruginosa persistence to CFD in both planktonic and sessile cultures; ii) assessing the in-duction of persistent and VBNC P. aeruginosa cells after exposure to sublethal CFD doses; iii) validating the obtained results in a preclinical mouse model of chronic infection.',
    },
    {
      title: 'Essential methods',
      description:
        'P. aeruginosa persistence to CFD was tested against P. aeruginosa PAO1 biofilms, maintained in conditions of nutrient depletion with/without sublethal CFD concentrations, and in a murine lung infection model. The amounts of culturable survivors and VBNC cells have been determined by plate count and qPCR assays, respectively. The results have been confirmed by confocal microscopy tests. The same approach was used to evaluate the efficiency of the CFD treatment in the murine model of P. aeruginosa lung infection. The synergy of CFD with tobramycin (TOB) was tested by checkerboard assays.',
    },
    {
      title: 'Results',
      description:
        'We previously demonstrated the lower induction of VBNC P. aeruginosa forms in CFD-exposed biofilms, rather than in TOB- and ceftazidime-exposed ones. The biofilm maintenance in the presence of sublethal CFD concentrations also led to a decrease in the amount of VBNC cells (87% of total viable cells) compared to simply starved biofilms (92%). The antibiotic treatment of the murine infection mirrored the in vitro data, showing a lower VBNC induction in CFD-treated animals. The combination TOB/CFD showed a synergistic effect (FIC index < 0.5) against both P. aeruginosa PAO1 cultures and biofilms.',
    },
    {
      title: 'Conclusions',
      description:
        'CFD-treatment showed a lower tendency to induce the VBNC state both in in vitro P. aeruginosa biofilms and in vivo infection models. This suggests the possibility of combinatory therapies with other drugs as effective eradication strategies. The combination TOB/CFD seems a promising alternative to be further evaluated and characterized in future studies.',
    },
  ],
  48: [
    {
      title: 'Background and rationale',
      description:
        'P13#1 is a protease-resistant peptoid mimicking cationic antimicrobial peptides. It shows antibacterial, antibiofilm and anti-inflammatory activities as well as synergy with colistin (Col) and tobramycin (Tb), two antibiotics widely used in cystic fibrosis lung infection. Unfortunately, its polymeric nature hampers direct delivery to the lung, where poor biodistribution and slow diffusion reduce efficacy and exacerbate its toxicity.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The main aim of the project was to develop inhalable polymeric nanoparticles (NPs) for lung delivery of P13#1, Col and Tb, alone and in combination.',
    },
    {
      title: 'Essential methods',
      description:
        'NPs made of polylactic-co-glycolic acid (PLGA) plus poloxamer P407, loaded with 2% drugs, were prepared using the solvent emulsion/diffusion technique at different PLGA:P407 ratios. Size, polydispersity index, ζ-potential, drug encapsulation efficiency, mucus interactions, drug release kinetics, antimicrobial and antibiofilm activity were determined. Given the low antimicrobial activity of P13#1-loaded PLGA/P407 NPs, we also developed chitosan (CS) NPs containing P13#1. CS-NPs were produced by ionic gelation with tripolyphosphate in the presence of P407, to modulate CS mucoadhesive properties. In vivo analysis in the CFaCore mouse model of lung infection of selected formulations is in pro-gress.',
    },
    {
      title: 'Results',
      description:
        'PLGA/P407 NPs exhibited properties suitable for pulmonary drug delivery and low interaction with mucin, suggesting that NPs can promote diffusion across lung barriers. Drug release was prolonged and sustained, especially for P13#1 (>20 days). Increasing the percentage of P407 resulted in a faster release rate due to enhanced hydrophilicity and porosity. Tb-loaded NPs showed biological activities slightly lower than those of free Tb, likely due to delayed release. Surprisingly, Col-loaded NPs showed antimicrobial and antibiofilm activity slightly higher than that of free Col. We demonstrated that the “excess” activity is due to the fact that P407 unexpectedly enhances Col efficacy. P13#1-loaded NPs showed essentially no antimicrobial activity due to the very slow release. The newly developed P13#1-loaded CS-NPs showed features suitable for pulmonary delivery: size =~300 nm, low PDI (0.1–0.2), positive ζ-potential. P13#1 was efficiently encapsulated and showed a sustained release for over 15 days.',
    },
    {
      title: 'Conclusions',
      description:
        'PLGA/P407 NPs proved to be very well suited to deliver Col and Tb in a highly active form, but not suited for P13#1 due to the very strong binding to PLGA. We are confident that the new CS-based NPs should solve the issue, as CS, differently from PLGA, is a cationic/hydrophilic polymer.',
    },
  ],
  49: [
    {
      title: 'Background and rationale',
      description:
        'People with cystic fibrosis are prone to bacterial infections, especially by Pseudomonas aeruginosa, a bacterium resistant to many antibiotic therapies. New care tools are therefore needed in these cases.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'The project aims to build peptides that stimulate the immune system against P. aeruginosa infections. We use an immunogenic region of the pilA protein of type IV pilus bound to a peptide scaffold. This region, the disulfide loop, is structured in a loop, and the scaffold is a peptide called TrpZip2, which forms a very stable hairpin. A cocktail of peptides, each with the immunogenic region of a specific strain, can be used as a vaccine. Molecular dynamics (MD) studies have shown that either by inserting the disulfide loop of the PAK strain in place of the TrpZip2 loop (molecule APT2) or by inserting it in the C-terminal position (molecule APT3), stable structures are obtained. In the first year, APT3 was shown to fold as expected, while APT2 showed a more complex folding.',
    },
    {
      title: 'Essential methods',
      description:
        'The molecules are modelled using Alphafold, and MD studies the stability of the folding. The experimental verification of the tertiary structure is studied with Circular Dichroism (CD) and Nuclear Magnetic Resonance (NMR). The first set of molecules was tested on mice.',
    },
    {
      title: 'Preliminary results',
      description:
        'In the second year, we addressed in vitro the structure of APT2 modified in the APT2KKK and APT4 peptides, which show a similar degree of structuring to APT2 using the NMR technique, i.e., a degree of partial structuring or the presence of multiple conformers in solution. We have returned to using the CD, which shows how APT3 is structured in a similar way to the scaffold, but APT2 is also not very different, thus suggesting using this molecule in vivo, too. In vivo tests of vaccination of mice with APT3 using two different aluminium-based adjuvants showed protection from P. aeruginosa bacteremia with a limited increase in antibody levels.',
    },
    {
      title: 'Conclusions',
      description:
        'The promising in vivo tests suggest that we continue the project using the same scheme for the disulfide loops of other strains.',
    },
  ],
  50: [
    {
      title: 'Background and rationale',
      description:
        'Cystic fibrosis (CF) is a frequent, multisystemic genetic disease due to bi-allelic loss-of-function variants of the CFTR gene. CFTR modulators, developed to rescue the CFTR defects due to specific variants, represent a significant advancement in CF treatment. The N1303K, the second most common CF-causing variant among Italian people with CF (pwCF), shows both trafficking and gating alterations, with heterogeneous response to modulators approved to rescue such defects.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Several factors may be responsible for this variability, and our data suggest that it is likely due to intrinsic properties of these epithelia. We aimed at investigating the molecular basis of the variable response of the N1303K variant to approved modulators by focusing on cisacting factors that may modulate CFTR expression or function.',
    },
    {
      title: 'Essential methods',
      description:
        'We assessed CFTR expression in N1303K-carrying and control human nasal epithelial cells (hNECs) through qPCR and end-point RT-PCR, combined with Sanger sequencing to assess potential unconventional splicing events or additional variants (both in cDNA and in genomic regulatory regions). A bulk RNA sequencing analysis has also been conducted on a selected subgroup of samples.',
    },
    {
      title: 'Preliminary results',
      description:
        'Functional analysis of CFTR activity in hNECs from N1303K pwCF samples revealed variable levels of pharmacological rescue, allowing classification into distinct response groups. We found that overall CFTR mRNA levels are similar in controls and N1303K samples, with a higher variability in controls compared to CF samples. RNAseq results revealed greater heterogeneity in terms of differentially expressed genes in controls compared to cases; notably, within the CF cohort, a non-responder was distinctly different from other responders; however, cDNA analysis did not identify additional variants. Moreover, an integration of locus-specific expression data with the results of RNAseq analysis has also been performed with the identification of allele-specific expression imbalances.',
    },
    {
      title: 'Conclusions',
      description:
        'CFTR expression levels do not reliably predict response to modulators, suggesting a more intricate regulatory landscape and the need for further study to enable personalized therapies for pwCF without approved treatments.',
    },
  ],
  51: [
    {
      title: 'Background and rationale',
      description:
        'Inflammation plays a central pathogenic role in cystic fibrosis (CF). We previously developed the first human CF airway-on-a-chip for inflammation studies. In year one of the project, we improved this model by assembling the “airway-on-a-chip 2.0” that incorporates CF endothelial cells (ECs) and CF fibroblasts (FBs). In year two, we studied vascularisation and analyzed inflammatory responses under elexacaftor/tezacaftor/ivacaftor (ETI).',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Since the endothelium is dysfunctional in CF and ECs and FBs in co-culture can form pseudo-vascular structures in vitro, we hypothesized that promoting neo-vascularisation within the chip would provide a more physiologically relevant platform for studying inflammation. The objectives were to: i) optimise endothelial–stromal interactions, ii) establish conditions for vascularized airway chips, iii) assess ETI effects on polymorphonuclear leukocyte (PMN) adhesion and migration.',
    },
    {
      title: 'Essential methods',
      description:
        'We first optimised EC–FB co-cultures in transwells and then transferred the knowledge to the chip. We tested different seeding strategies, comparing early versus late EC introduction to achieve stromal vascularisation without system obstruction. We run PMN perfusion assays in the presence or absence of ETI and collected media for cytokine/chemokine analysis. We also analyzed CF EC and FB monocultures for PMN adhesion and proteolytic activity.',
    },
    {
      title: 'Preliminary results',
      description:
        'Transwell cultures showed EC-derived pseudo-vessels in the stroma. In chips, early high-density FB seeding induced extensive vascularisation but obstructed the flow, plausibly biasing PMN behaviour. Introducing ECs two days before PMN perfusion enabled endothelial–stromal remodeling while preserving system functionality. Preliminary data showed that ETI treatment did not affect PMN recruitment in the chip but decreased PMN adhesion to CF ECs. CF FBs showed reduced MMP-1, MMP-9, and Cathepsin-S, suggesting impaired matrix remodeling and a potential fibrotic phenotype.',
    },
    {
      title: 'Conclusions',
      description:
        'We consolidated the airway-on-a-chip 2.0 by defining vascularisation conditions and initiating ETI testing. Results highlight the crucial contribution of CF ECs and FBs to inflammation, with ETI reducing PMN adhesion to CF ECs but not overall recruitment in the chip. Findings provide insights into the role of endothelium and matrix remodeling in CF airway inflammation. The optimised model will be used in year three for ETI treatment and bacterial infection.',
    },
  ],
  52: [
    {
      title: 'Background and rationale',
      description:
        'Loss-of-function of the CFTR chloride channel impairs mucociliary clearance (MCC), causing cystic fibrosis (CF) lung disease. Alternative targets, such as the Ca2+-activated TMEM16A chloride channel, are considered for the treatment of patients carrying undruggable CFTR mutations. However, the best approach to target TMEM16A in CF, whether with potentiators or inhibitors, is a matter of debate. Another alternative target is the TRPV4 calcium channel. TRPV4 is a potential sensor of mechanical and chemical stimuli, involved in the response to pathogens and linked to CFTR activity.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesise that TMEM16A and TRPV4 could be alternative therapeutic targets in CF. Our goal is to clarify their role in the airways to modulate them in the most appropriate way. For TMEM16A, we used the CRISPR/Cas9 strategy to knock out the gene in airway epithelial cells and evaluate the consequences on airway surface properties. Regarding TRPV4, we are investigating the mechanisms linking this channel to CFTR and to Ca2+-activated dual oxidases that produce H2O2 as a bactericidal agent.',
    },
    {
      title: 'Essential methods',
      description:
        'We are using differentiated human bronchial epithelia (HBE) in which TMEM16A and TRPV4 function are altered with genetic and/or pharmacological approaches. We carried out a panel of experiments to evaluate intracellular calcium mobilization. We are evaluating the airway surface liquid properties, mucin secretion, epithelial composition/morphology, and H2O2 production.',
    },
    {
      title: 'Preliminary results',
      description:
        'TMEM16A-defective epithelia, generated by nucleofection of basal stem cells, showed a near total ablation of calcium-dependent chloride secretion without alteration of calcium signaling. Pharmacological TRPV4 activation leads to the release of ATP, which then activates CFTR through stimulation of adenosine and purinergic receptors. Bacterial supernatants elicited a significant calcium increase, possibly through TRPV4.',
    },
    {
      title: 'Conclusions',
      description:
        'The results obtained so far show that we are able to ablate TMEM16A function in differentiated epithelia, which will allow us to assess its physiological role. TRPV4 appears to regulate H2O2 and ATP release. It will be important now to determine how pharmacological modulation of TMEM16A and TRPV4 leads to improvements in airway surface hydration and innate defense mechanisms of the airway epithelium.',
    },
  ],
  53: [
    {
      title: 'Background and rationale',
      description:
        'Persistent activation of the mucosal immune system and recurrent bacterial infections are major drivers of pulmonary decline in CF. Among airway pathogens, Pseudomonas aeruginosa (Pa) is a key inducer of immune dysregulation by altering dendritic cell (DC) functions and promoting the generation of pathogenic IFNγ-producing Th17 cells. However, the molecular mechanisms through which Pa-infected DCs drive this skewing remain elusive.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'We hypothesize that Pa persistence within CF-derived DCs reshapes both bacterial and host transcriptomes, establishing a proinflammatory environment that polarizes and reprograms protective Th17 into pathogenic IFNγ-producing Th17 cells. Our goal is to elucidate the dual host–pathogen transcriptional programs sustaining Th17-driven immunopathology, ultimately identifying microbial and immunological targets to selectively block detrimental inflammation and lung damage in CF.',
    },
    {
      title: 'Essential methods',
      description:
        'We applied a dual-RNA sequencing approach to simultaneously analyse host and bacterial transcriptional profiles during Pa persistence within CF-derived DCs. In parallel, single-cell RNA sequencing of DCs isolated from sputum of CF patients with Pa pulmonary infection provided a high-resolution definition of Pa-induced immunomodulation within the lung microenvironment.',
    },
    {
      title: 'Preliminary results',
      description:
        'Pa displays an intrinsic ability to persist within DCs, inducing the release of high levels of polarizing cytokines and highly driving the skewing of protective cTh17 into pathogenic IFNγ-producing Th17 cells, even at the early stage of the disease. Dual-RNAseq revealed that Pa persistence within CF-DCs profoundly rewired the transcriptional program: 307 bacterial genes were upregulated, largely linked to metabolic optimization for intracellular survival. Infected DCs exhibited 2040 up- and 1698 down-regulated genes. Among the host genes induced during Pa persistence, anti-apoptotic pathways were markedly upregulated, suggesting that Pa actively prevents DC death to establish its intracellular niche and sustain an exaggerated inflammatory response. Notably, pathway enrichment analysis revealed a robust activation of TNF, IL-17, and JAK–STAT signaling, together with Th17 differentiation programs, underscoring the emergence of a proinflammatory DC phenotype specifically primed to drive pathogenic Th17 responses.',
    },
    {
      title: 'Conclusions',
      description:
        'Our study delineates a dual host–pathogen transcriptomic signature of Pa-infected DCs in CF, uncovering key mechanisms by which Pa orchestrates DC-mediated polarization of pathogenic Th17 subsets. By dissecting these pathways, we will identify novel immune checkpoints and druggable microbial and host targets. This provides a framework for next-generation immunotherapies aimed at selectively blocking detrimental inflammation, ultimately preventing lung damage and further improving clinical outcomes in CF.',
    },
  ],
  54: [
    {
      title: 'Background and rationale',
      description:
        'Despite CFTR-modulator therapies, respiratory complications remain a concern for people with cystic fibrosis (pwCF), highlighting the need to understand the disease mechanisms for new diagnostic and treatment strategies. Beyond the lungs, the gut shares key structural features, including mucus-secreting epithelia and barrier dysfunctions, and manifests over-lapping inflammatory changes.',
    },
    {
      title: 'Hypothesis and objectives',
      description:
        'Emerging data support a gut-lung axis that may sustain persistent airway inflammation despite CFTR modulator therapy. Our aim is to establish the mechanistic links between gut pathology, microbiota, and pulmonary inflammation, which have largely remained unexplored due to the lack of genetically diverse animal models that fully represent the disease features observed in pwCF.',
    },
    {
      title: 'Essential methods',
      description:
        'We used a Collaborative Cross CF mouse model with F508del mutation (CC037-F508del) and a new gastrointestinal Pseudomonas aeruginosa infection model. Pathological, transcriptomic, and immunological responses were studied in the lung, gut, and blood to characterize the host response. Microbial contributions were assessed using metatranscriptomics and culture-based approaches. A pwCF cohort was recruited to analyze sputum and stool microbiology.',
    },
    {
      title: 'Preliminary results',
      description:
        'Immunophenotyping and single-nucleus RNA sequencing showed early lung and systemic inflammation, including responses to bacterial pathogens, preceding structural damage in CC037-F508del mice. Culture and metatranscriptomics revealed a substantial bacterial burden in the lungs. Remarkably, this included species typically associated with the gut, suggesting overlaps between lung and gut microbiota. Intestinal inflammation, dysbiosis, and impaired barrier function were observed alongside increased pulmonary and systemic immune activation. Following gut infection with P. aeruginosa, CC037-F508del mice exhibited persistent bacterial colonization in the gastrointestinal tract and stool, whereas CC037-wt mice were able to control the infection. The recovery of P. aeruginosa from the lung following gut colonization supports the cross-talk between these sites. Data from pwCF indicate that CF pathogens can also be recovered from stool samples, and potential correlations with sputum are under evaluation.',
    },
    {
      title: 'Conclusions',
      description:
        'These findings provide evidence for a gut-lung axis in CF, highlighting its contribution to immune dysregulation and microbial dynamics. We suggest that gut pathology may drive and exacerbate lung disease and support new diagnostic and therapeutic strategies beyond lung-focused approaches.',
    },
  ],
}
