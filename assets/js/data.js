/* ==========================================================================
   ScalingDepth — community data
   --------------------------------------------------------------------------
   To add a method / paper / news item, append an object to the matching
   array below and open a Pull Request. See CONTRIBUTING.md for the schema.
   Formulas use KaTeX syntax and are intentionally simplified ("schematic");
   always refer to the original paper for the exact parameterisation.
   ========================================================================== */

window.SD = {};

/* ---------- Families of residual connections ---------- */
SD.families = [
  {
    id: "classic",
    name: "Classic Shortcuts",
    icon: "↗",
    blurb: "Identity, gated and dense shortcuts that first made very deep networks trainable."
  },
  {
    id: "norm",
    name: "Normalization Placement",
    icon: "◎",
    blurb: "Where the LayerNorm sits relative to the residual branch — Post-LN, Pre-LN and everything in between."
  },
  {
    id: "scaling",
    name: "Residual Scaling & Parametrization",
    icon: "α",
    blurb: "Learnable or depth-aware branch multipliers, initialisations and parametrizations (Depth-µP, CompleteP) that keep the residual stream well-conditioned and hyperparameters transferable across depth."
  },
  {
    id: "aggregation",
    name: "Cross-Layer Aggregation",
    icon: "Σ",
    blurb: "Each layer reads a (learned, possibly input-dependent) mixture of all earlier layer outputs."
  },
  {
    id: "multistream",
    name: "Multi-Stream / Hyper-Connections",
    icon: "≋",
    blurb: "Widen the residual stream into n parallel streams with learned read, write and mixing maps."
  }
];

/* ---------- Residual connection methods ----------
   depthbench: true  -> one of the 10 architectures evaluated in DepthBench
   date: "YYYY-MM"   -> release month, only needed when there is no arxiv id
                        (the Residuals page sorts by arXiv/release time)       */
SD.methods = [
  // ---------------- Classic Shortcuts ----------------
  {
    id: "highway", name: "Highway Networks", family: "classic", year: 2015,
    authors: "Srivastava, Greff, Schmidhuber", venue: "ICML DL Workshop 2015",
    arxiv: "1505.00387",
    formula: "x_{l+1} = T(x_l)\\odot H(x_l) + \\big(1-T(x_l)\\big)\\odot x_l",
    desc: "Gated shortcut: a learned transform gate decides how much of the input is carried through unchanged. The direct precursor of the identity residual.",
    tags: ["gating", "CNN"]
  },
  {
    id: "resnet", name: "ResNet (Identity Residual)", family: "classic", year: 2015,
    authors: "He, Zhang, Ren, Sun", venue: "CVPR 2016",
    arxiv: "1512.03385",
    formula: "x_{l+1} = x_l + F_l(x_l)",
    desc: "The identity shortcut. Layers learn residual functions w.r.t. their input, enabling 100+ layer networks. Every method on this site is a variation of this line.",
    tags: ["foundational", "CNN"]
  },
  {
    id: "stochdepth", name: "Stochastic Depth", family: "classic", year: 2016,
    authors: "Huang, Sun, Liu, Sedra, Weinberger", venue: "ECCV 2016",
    arxiv: "1603.09382",
    formula: "x_{l+1} = x_l + b_l\\,F_l(x_l),\\quad b_l\\sim\\mathrm{Bernoulli}(p_l)",
    desc: "Randomly drops whole residual blocks during training (DropPath). Shows that residual networks behave like ensembles of shallower paths.",
    tags: ["regularisation"]
  },
  {
    id: "densenet", name: "DenseNet", family: "classic", year: 2016,
    authors: "Huang, Liu, van der Maaten, Weinberger", venue: "CVPR 2017",
    arxiv: "1608.06993",
    formula: "x_l = H_l\\big([x_0, x_1, \\dots, x_{l-1}]\\big)",
    desc: "Concatenates the outputs of all preceding layers as input to each layer — the ancestor of modern cross-layer aggregation in Transformers.",
    tags: ["dense", "CNN"]
  },

  // ---------------- Normalization Placement ----------------
  {
    id: "postln", name: "Post-LN Transformer", family: "norm", year: 2017,
    authors: "Vaswani et al.", venue: "NeurIPS 2017",
    arxiv: "1706.03762",
    formula: "x_{l+1} = \\mathrm{LN}\\big(x_l + F_l(x_l)\\big)",
    desc: "The original Transformer: normalisation after the residual addition. Expressive but hard to train at depth without warm-up.",
    tags: ["Transformer"]
  },
  {
    id: "preln", name: "Pre-LN", family: "norm", year: 2020,
    authors: "Xiong et al.", venue: "ICML 2020",
    arxiv: "2002.04745",
    formula: "x_{l+1} = x_l + F_l\\big(\\mathrm{LN}(x_l)\\big)",
    desc: "Normalise inside the branch, keep a clean identity path. The de-facto default in LLMs. Stable to train, but deep layers tend to collapse toward small, similar updates.",
    tags: ["Transformer", "LLM default"], depthbench: true
  },
  {
    id: "sandwich", name: "Sandwich-LN", family: "norm", year: 2021,
    authors: "Ding et al. (CogView)", venue: "NeurIPS 2021",
    arxiv: "2105.13290",
    formula: "x_{l+1} = x_l + \\mathrm{LN}\\Big(F_l\\big(\\mathrm{LN}(x_l)\\big)\\Big)",
    desc: "Normalises both before and after the branch to bound the magnitude of each residual update.",
    tags: ["Transformer"], depthbench: true
  },
  {
    id: "mixln", name: "Mix-LN", family: "norm", year: 2024,
    authors: "Li, Yin, Liu", venue: "ICLR 2025",
    arxiv: "2412.13795",
    formula: "x_{l+1} = \\begin{cases}\\mathrm{LN}(x_l+F_l(x_l)) & l<\\rho L\\\\ x_l+F_l(\\mathrm{LN}(x_l)) & l\\ge\\rho L\\end{cases}",
    desc: "Post-LN for early layers and Pre-LN for later layers, giving more uniform gradient norms and more useful deep layers.",
    tags: ["Transformer", "LLM"]
  },
  {
    id: "periln", name: "Peri-LN", family: "norm", year: 2025,
    authors: "Kim et al.", venue: "ICML 2025",
    arxiv: "2502.02732",
    formula: "x_{l+1} = x_l + \\mathrm{LN}_{\\text{out}}\\Big(F_l\\big(\\mathrm{LN}_{\\text{in}}(x_l)\\big)\\Big)",
    desc: "Revisits normalisation placement and argues for wrapping each sub-layer with input and output normalisation for stable large-scale training.",
    tags: ["Transformer", "LLM"]
  },
  {
    id: "lns", name: "LayerNorm Scaling (LNS)", family: "norm", year: 2025,
    authors: "Sun et al.", venue: "The Curse of Depth in LLMs",
    arxiv: "2502.05795",
    formula: "x_{l+1} = x_l + F_l\\!\\left(\\tfrac{1}{\\sqrt{l}}\\,\\mathrm{LN}(x_l)\\right)",
    desc: "Identifies the 'curse of depth' in Pre-LN LLMs (output variance grows with depth) and fixes it by scaling the normalised input by 1/√l.",
    tags: ["Transformer", "LLM"], depthbench: true
  },
  {
    id: "keel", name: "KEEL", family: "norm", year: 2026,
    authors: "Chen, Wei", venue: "Post-LayerNorm Is Back",
    arxiv: "2601.19895",
    formula: "x_{l+1} = \\mathrm{LN}\\Big(\\alpha\\,x_l + F_l\\big(\\mathrm{LN}(x_l)\\big)\\Big)",
    desc: "\"Stable, ExpressivE, and dEep\": combines pre- and post-normalisation with a large residual gain to bring Post-LN back at depth. (Schematic form.)",
    tags: ["Transformer", "Post-LN"], depthbench: true
  },
  {
    id: "ngpt", name: "nGPT", family: "norm", year: 2024,
    authors: "Loshchilov, Hsieh, Sun, Ginsburg", venue: "ICLR 2025",
    arxiv: "2410.01131",
    formula: "h \\leftarrow \\mathrm{Norm}\\big(h + \\alpha\\,(\\mathrm{Norm}(F(h)) - h)\\big)",
    desc: "Keeps all hidden states on the unit hypersphere; each layer takes a learned step toward its output, turning the residual into spherical interpolation.",
    tags: ["Transformer", "hypersphere"]
  },
  {
    id: "residual-dual", name: "ResiDual", family: "norm", year: 2023,
    authors: "Xie, Zhang, Guo, Tan et al.", venue: "arXiv 2023",
    arxiv: "2304.14802",
    formula: "x^{\\text{post}}_{l+1} = \\mathrm{LN}(x^{\\text{post}}_l + F_l),\\quad x^{\\text{pre}}_{l+1} = x^{\\text{pre}}_l + F_l",
    desc: "Pre-Post-LN: keeps a Post-LN stream and a Pre-LN stream side by side, aiming to avoid both Post-LN gradient vanishing and Pre-LN representation collapse.",
    tags: ["Transformer", "dual residual"]
  },
  {
    id: "hybridnorm", name: "HybridNorm", family: "norm", year: 2025,
    authors: "Zhuo, Zeng, Wang, Zhang et al.", venue: "NeurIPS 2025",
    arxiv: "2503.04598",
    formula: "\\text{attn: QKV-Norm},\\quad x_{l+1} = \\mathrm{LN}\\big(h_l + \\mathrm{FFN}(h_l)\\big)",
    desc: "QKV normalisation inside attention plus Post-Norm in the FFN of every block, combining Pre-Norm stability with Post-Norm quality.",
    tags: ["Transformer", "LLM"]
  },
  {
    id: "dyt", name: "Dynamic Tanh (DyT)", family: "norm", year: 2025,
    authors: "Zhu, Chen, He, LeCun", venue: "CVPR 2025",
    arxiv: "2503.10622",
    formula: "\\mathrm{DyT}(x) = \\gamma\\odot\\tanh(\\alpha x) + \\beta",
    desc: "Replaces every LayerNorm with an element-wise tanh(αx), motivated by the S-shaped input–output maps LayerNorm learns. Normalisation-free Transformers that match normalised ones.",
    tags: ["norm-free", "Transformer"]
  },
  {
    id: "geonorm", name: "GeoNorm", family: "norm", year: 2026,
    authors: "Zheng, Sun, Gao, Wang", venue: "arXiv 2026",
    arxiv: "2601.22095",
    formula: "x_{l+1} = \\mathrm{Exp}_{x_l}\\big(\\eta_l\\,F_l(x_l)\\big)\\ \\text{on the sphere}",
    desc: "Treats each sub-layer output as an update direction and replaces normalisation with geodesic steps on a manifold, with a layer-wise update decay. Unifies Pre- and Post-Norm. (Schematic form.)",
    tags: ["Transformer", "manifold"]
  },
  {
    id: "siamesenorm", name: "SiameseNorm", family: "norm", year: 2026,
    authors: "Li, Han, Cao, Huang et al.", venue: "ICML 2026",
    arxiv: "2602.08064",
    formula: "\\begin{aligned}x^{\\text{pre}}_{l+1} &= x^{\\text{pre}}_l + F_l(\\cdot)\\\\ x^{\\text{post}}_{l+1} &= \\mathrm{LN}\\big(x^{\\text{post}}_l + F_l(\\cdot)\\big)\\end{aligned}",
    desc: "Two-stream architecture that couples a Pre-Norm-like and a Post-Norm-like stream through shared residual blocks, so each block gets optimisation signal from both. Compatible with Pre-Norm training recipes. (Schematic form.)",
    tags: ["Transformer", "two-stream"]
  },
  {
    id: "kitenorm", name: "KiteNorm", family: "norm", year: 2026,
    authors: "Trochelmann, Movahedi, Liu, Orvieto", venue: "ICML 2026 Workshop (HiLD)",
    link: "https://openreview.net/forum?id=bUwyEMBY5t", linkLabel: "OpenReview",
    formula: "x_{l+1} = \\mathrm{LN}\\big(a_l\\,x_l + b_l\\,F_l(x_l)\\big) \\;+\\; \\text{variance reg.}",
    desc: "Stabilises Post-LN Transformers at large learning rates with residual scaling, separate learned scales for the skip and residual branches, and a hidden-state variance regulariser. Links Post-LN gradient vanishing to rank collapse. (Schematic form.)",
    tags: ["Post-LN", "Transformer"]
  },

  // ---------------- Residual Scaling & Init ----------------
  {
    id: "fixup", name: "Fixup", family: "scaling", year: 2019,
    authors: "Zhang, Dauphin, Ma", venue: "ICLR 2019",
    arxiv: "1901.09321",
    formula: "W_{\\text{branch}} \\leftarrow L^{-\\frac{1}{2m-2}}\\,W_{\\text{branch}},\\quad x_{l+1}=x_l+F_l(x_l)",
    desc: "Trains deep residual networks without normalisation by rescaling the initialisation of each residual branch with the depth L.",
    tags: ["initialisation", "norm-free"]
  },
  {
    id: "rezero", name: "ReZero", family: "scaling", year: 2020,
    authors: "Bachlechner et al.", venue: "UAI 2021",
    arxiv: "2003.04887",
    formula: "x_{l+1} = x_l + \\alpha_l\\,F_l(x_l),\\quad \\alpha_l^{(0)}=0",
    desc: "A single learnable scalar per layer, initialised at zero, so every block starts as the identity. Removes the need for LayerNorm and warm-up.",
    tags: ["norm-free", "gain"]
  },
  {
    id: "skipinit", name: "SkipInit", family: "scaling", year: 2020,
    authors: "De, Smith", venue: "NeurIPS 2020",
    arxiv: "2002.10444",
    formula: "x_{l+1} = x_l + \\alpha_l\\,F_l(x_l),\\quad \\alpha_l^{(0)}\\approx 0",
    desc: "Shows BatchNorm biases residual blocks toward the identity; a zero-initialised scalar on the branch recovers that benefit without normalisation.",
    tags: ["norm-free", "gain"]
  },
  {
    id: "admin", name: "Admin", family: "scaling", year: 2020,
    authors: "Liu, Liu, Gao, Chen, Han", venue: "EMNLP 2020",
    arxiv: "2004.08249",
    formula: "x_{l+1} = \\mathrm{LN}\\big(x_l\\odot\\omega_l + F_l(x_l)\\big)",
    desc: "Diagnoses amplified dependency on the residual branch as the cause of Post-LN instability; a profiled initialisation of ω controls it.",
    tags: ["Post-LN", "initialisation"]
  },
  {
    id: "layerscale", name: "LayerScale", family: "scaling", year: 2021,
    authors: "Touvron et al. (CaiT)", venue: "ICCV 2021",
    arxiv: "2103.17239",
    formula: "x_{l+1} = x_l + \\mathrm{diag}(\\lambda_l)\\,F_l\\big(\\mathrm{LN}(x_l)\\big),\\quad \\lambda^{(0)}=\\epsilon",
    desc: "Per-channel learnable gains initialised to a small ε; a key ingredient for training deeper Vision Transformers.",
    tags: ["ViT", "gain"]
  },
  {
    id: "deepnorm", name: "DeepNorm", family: "scaling", year: 2022,
    authors: "Wang et al. (DeepNet)", venue: "TPAMI 2024",
    arxiv: "2203.00555",
    formula: "x_{l+1} = \\mathrm{LN}\\big(\\alpha\\,x_l + F_l(x_l)\\big),\\ \\alpha>1,\\ W\\!\\leftarrow\\!\\beta W",
    desc: "Up-weights the residual and down-scales branch initialisation (β) as a function of depth, scaling Post-LN Transformers to 1,000 layers.",
    tags: ["Post-LN", "1000 layers"], depthbench: true
  },
  {
    id: "depth-mup", name: "Depth-µP", family: "scaling", year: 2023,
    authors: "Yang, Yu, Zhu, Hayou", venue: "ICLR 2024",
    arxiv: "2310.02244",
    formula: "x_{l+1} = x_l + \\tfrac{a}{\\sqrt{L}}\\,F_l(x_l),\\quad \\eta \\ \\text{rescaled with } L",
    desc: "Tensor Programs VI: extends µP to depth. A 1/√L branch multiplier with matching learning-rate scaling gives the optimal infinite-depth limit, maximises feature diversity, and transfers hyperparameters across depth.",
    tags: ["parametrization", "HP transfer"]
  },
  {
    id: "depthwise-transfer", name: "1/√L Residual Scaling", family: "scaling", year: 2023,
    authors: "Bordelon, Noci, Li, Hanin", venue: "ICLR 2024",
    arxiv: "2309.16620",
    formula: "x_{l+1} = x_l + \\tfrac{1}{\\sqrt{L}}\\,F_l(x_l)\\quad (+\\,\\mu\\text{P in width})",
    desc: "Depthwise hyperparameter transfer: combining µP with a 1/√depth branch scale lets ResNets and ViTs transfer optimal hyperparameters across width and depth, with a dynamical mean-field theory of the limit.",
    tags: ["parametrization", "HP transfer"]
  },
  {
    id: "completep", name: "CompleteP", family: "scaling", year: 2025,
    authors: "Dey, Zhang, Noci, Li", venue: "NeurIPS 2025",
    arxiv: "2505.01618",
    formula: "x_{l+1} = x_l + \\tfrac{1}{L}\\,F_l(x_l),\\quad \\eta,\\ \\lambda,\\ \\epsilon \\ \\text{rescaled with } L",
    desc: "The α = 1 depth parametrization: a 1/L branch multiplier with depth-adjusted LR, weight decay and AdamW ε. Gives depth-wise HP transfer and keeps every layer out of the lazy regime, so more width/depth ratios stay compute-efficient.",
    tags: ["parametrization", "HP transfer", "LLM"]
  },

  // ---------------- Cross-Layer Aggregation ----------------
  {
    id: "realformer", name: "RealFormer", family: "aggregation", year: 2020,
    authors: "He, Ravula, Kanagal, Ainslie", venue: "ACL Findings 2021",
    arxiv: "2012.11747",
    formula: "S_l = \\tfrac{Q_lK_l^\\top}{\\sqrt d} + S_{l-1}",
    desc: "Adds a residual path for the pre-softmax attention scores across layers ('residual attention').",
    tags: ["attention scores"]
  },
  {
    id: "denseformer", name: "DenseFormer", family: "aggregation", year: 2024,
    authors: "Pagliardini et al.", venue: "NeurIPS 2024",
    arxiv: "2402.02622",
    formula: "\\tilde x_l = \\sum_{i=0}^{l} \\alpha_{l,i}\\,x_i",
    desc: "Depth-Weighted-Average after each block: a learned static mixture over all previous representations, at negligible parameter cost.",
    tags: ["dense", "static weights"]
  },
  {
    id: "valueres", name: "Value Residual (ResFormer)", family: "aggregation", year: 2024,
    authors: "Zhou et al.", venue: "ACL 2025",
    arxiv: "2410.17897",
    formula: "V_l \\leftarrow \\lambda_1\\,V_l + \\lambda_2\\,V_1",
    desc: "Adds a residual connection from the first layer's attention values to every later layer, alleviating attention concentration in deep layers.",
    tags: ["values", "attention"]
  },
  {
    id: "rwkv7-vres", name: "RWKV-7 Value Residual", family: "aggregation", year: 2025,
    authors: "Peng et al.", venue: "RWKV-7 \"Goose\"",
    arxiv: "2503.14456",
    formula: "v_l \\leftarrow v_l + \\big(v_1 - v_l\\big)\\odot\\sigma\\big(g_l(x_l)\\big)",
    desc: "RWKV-7 interpolates each layer's value vector toward the first layer's values with a learned, token-dependent gate. This brings value residual learning to a linear-attention / RNN architecture.",
    tags: ["values", "RNN", "linear attention"]
  },
  {
    id: "laurel", name: "LAuReL", family: "aggregation", year: 2024,
    authors: "Menghani, Kumar, Kumar", venue: "ICML 2025",
    arxiv: "2411.07501",
    formula: "x_{l+1} = \\alpha\\,F_l(x_l) + g_l(x_l, x_{l-1},\\dots)",
    desc: "Learned Augmented Residual Layer: generalises the identity path with learned scalars, low-rank maps and/or previous activations.",
    tags: ["low-rank", "drop-in"]
  },
  {
    id: "dca", name: "DeepCrossAttention", family: "aggregation", year: 2025,
    authors: "Heddes et al.", venue: "ICML 2025",
    arxiv: "2502.06785",
    formula: "q,k,v \\leftarrow \\textstyle\\sum_{i\\le l} w^{q,k,v}_{i}(x)\\,x_i",
    desc: "Input-dependent weighted combinations of previous layer outputs feed queries, keys and values separately.",
    tags: ["dynamic weights", "attention"]
  },
  {
    id: "muddformer", name: "MUDDFormer", family: "aggregation", year: 2025,
    authors: "Xiao et al.", venue: "ICML 2025",
    arxiv: "2502.12170",
    formula: "x^{s}_{l} = \\textstyle\\sum_{i\\le l} a^{s}_{l,i}(x_l)\\,x_i,\\ s\\in\\{Q,K,V,R\\}",
    desc: "MUltiway Dynamic Dense connections: separate, position-dependent dense aggregations for the query, key, value and residual streams.",
    tags: ["dynamic weights", "dense"]
  },
  {
    id: "attnres-full", name: "AttnRes (Full)", family: "aggregation", year: 2026,
    authors: "Kimi Team", venue: "Attention Residuals",
    arxiv: "2603.15031",
    formula: "h_l = \\textstyle\\sum_{i<l} \\mathrm{softmax}_i\\!\\big(q_l^{\\top} k_i\\big)\\, v_i",
    desc: "Replaces the fixed sum of the residual stream with softmax attention over all preceding layer outputs. Lets each layer choose which earlier representations to read from.",
    tags: ["attention over depth"], depthbench: true
  },
  {
    id: "attnres-block", name: "AttnRes (Block)", family: "aggregation", year: 2026,
    authors: "Kimi Team", venue: "Attention Residuals",
    arxiv: "2603.15031",
    formula: "h_l = \\textstyle\\sum_{b<B(l)} \\mathrm{softmax}_b\\!\\big(q_l^{\\top} k_b\\big)\\, \\bar v_b",
    desc: "Efficient variant that attends over block-aggregated summaries instead of every layer; cheaper in memory and communication than Full AttnRes.",
    tags: ["attention over depth", "efficient"], depthbench: true
  },
  {
    id: "moda", name: "MoDA", family: "aggregation", year: 2026,
    authors: "Zhu, Fang, Liao et al.", venue: "Mixture-of-Depths Attention",
    arxiv: "2603.15619",
    formula: "\\mathrm{Attn}\\big(q_l,\\ [K^{\\text{seq}}_l; K^{\\text{depth}}_{<l}],\\ [V^{\\text{seq}}_l; V^{\\text{depth}}_{<l}]\\big)",
    desc: "Mixture-of-Depths Attention: attention heads read key-value pairs from both the current sequence and preceding layers, mixing information across depth dynamically.",
    tags: ["attention over depth", "KV"], depthbench: true
  },
  {
    id: "attnres-delta", name: "Delta AttnRes", family: "aggregation", year: 2026,
    authors: "Luo, Cai, Hu et al.", venue: "arXiv 2026",
    arxiv: "2605.18855",
    formula: "h_l = \\textstyle\\sum_{i<l} a_{l,i}\\,\\Delta_i",
    desc: "Follow-up to Attention Residuals that aggregates over layer updates (deltas) rather than raw outputs. (Schematic form.)",
    tags: ["attention over depth", "AttnRes family"]
  },
  {
    id: "attnres-lowrank", name: "Low-Rank AttnRes", family: "aggregation", year: 2026,
    authors: "Su", venue: "arXiv 2026",
    arxiv: "2607.09694",
    formula: "h_l = \\textstyle\\sum_{i<l} a_{l,i}\\,U V^{\\top} x_i",
    desc: "Low-rank parameterisation of attention residuals to reduce the cost of attending over depth. (Schematic form.)",
    tags: ["attention over depth", "AttnRes family", "efficient"]
  },
  {
    id: "attnres-mh", name: "Multi-Head AttnRes", family: "aggregation", year: 2026,
    authors: "Luo, Cai, Hu et al.", venue: "arXiv 2026",
    arxiv: "2607.27230",
    formula: "h_l = \\big\\Vert_{j=1}^{H} \\textstyle\\sum_{i<l} a^{(j)}_{l,i}\\, v^{(j)}_i",
    desc: "Splits depth-wise attention into multiple heads so different sub-spaces can route from different earlier layers. (Schematic form.)",
    tags: ["attention over depth", "AttnRes family"]
  },
  {
    id: "attnres-dual", name: "Dual AttnRes", family: "aggregation", year: 2026,
    authors: "Yu, Li, Liu et al.", venue: "arXiv 2026",
    arxiv: "2607.18730",
    formula: "h_l = \\mathrm{AttnRes}_{\\text{attn}}(\\cdot) + \\mathrm{AttnRes}_{\\text{mlp}}(\\cdot)",
    desc: "Dual Attention Residuals: a two-path extension of depth-wise attention residuals. (Schematic form.)",
    tags: ["attention over depth", "AttnRes family"]
  },
  {
    id: "msar", name: "Multi-Stream Attention Residuals (MSAR)", family: "aggregation", year: 2026,
    authors: "Qin, Zhang et al.", venue: "arXiv 2026",
    arxiv: "2610.13630",
    link: "https://github.com/jianke0604/MSAR", linkLabel: "Project",
    formula: "z_l^{(r)} = \\sum_{i<l} \\alpha_{i\\to l}^{(r)}\\,\\mathcal E_{i,r}[v_i],\\; x_l = \\sum_{r=0}^{m-1} g_l^{(r)}\\,z_l^{(r)}",
    desc: "Expands sources v via identity / multi-scale causal depthwise convolutions E, retrieves per stream with depth-softmax weights alpha, and fuses results with adaptive gates g. Block MSAR expands accumulated single-stream summaries on demand. (Schematic form.)",
    tags: ["attention over depth", "multi-stream", "causal convolution"]
  },
  {
    id: "ldm", name: "Linear Depth Memory (LDM)", family: "aggregation", year: 2026,
    authors: "González-Martínez, Nazari et al.", venue: "arXiv 2026",
    arxiv: "2610.18809",
    code: "https://github.com/davidgonmar/depth-memory",
    formula: "\\begin{aligned} &x_{l+1} = x_l + v_l,\\quad v_l = F_l\\big(x_l + M_l q_l\\big)\\\\ &(M_{l+1}, P_{l+1}) = \\mathrm{RLS}\\big(M_l, P_l;\\ k_l, v_l\\big) \\end{aligned}",
    desc: "Each layer reads from and writes to a fixed-size linear memory over depth. The memory represents the solution of an online linear regression objective. (Schematic form.)",
    tags: ["memory over depth", "RLS", "fixed-size state"]
  },
  {
    id: "dagformer", name: "DAGFormer", family: "aggregation", year: 2026,
    authors: "Yang, Hao, Zhai", venue: "arXiv 2026",
    arxiv: "2610.19625",
    formula: "q_h,\\,k_h,\\,v_h,\\,R_l \\leftarrow \\textstyle\\sum_{j<l} \\alpha^{(l)}_{\\cdot,j}\\,X_j,\\quad \\{\\alpha^{(l)}\\}_{l\\le L} = P_\\phi(\\text{tokens})",
    desc: "A jointly trained topology predictor reads the tokens and plans the cross-layer graph for the whole model at once: signed weights alpha decide how each layer's queries, keys, values and residual draw on all earlier outputs. Initialised to the vanilla Transformer. (Schematic form.)",
    tags: ["dynamic weights", "global topology", "DAG"]
  },

  // ---------------- Multi-Stream / Hyper-Connections ----------------
  {
    id: "hc", name: "Hyper-Connections (HC)", family: "multistream", year: 2024,
    authors: "Zhu et al.", venue: "ICLR 2025",
    arxiv: "2409.19606",
    formula: "H_{l+1} = A_l H_l + \\beta_l\\, F_l\\big(\\alpha_l^{\\top} H_l\\big),\\quad H_l\\in\\mathbb R^{n\\times d}",
    desc: "Expands the residual stream into n streams with learned read (α), write (β) and stream-mixing (A) maps. Lets the network learn how strongly each layer's output is mixed into the residual stream.",
    tags: ["n streams", "dynamic"], depthbench: true
  },
  {
    id: "mhc", name: "Manifold-Constrained HC (mHC)", family: "multistream", year: 2025,
    authors: "Xie et al. (DeepSeek)", venue: "arXiv 2025",
    arxiv: "2512.24880",
    formula: "H_{l+1} = A_l H_l + \\beta_l F_l(\\alpha_l^{\\top} H_l),\\quad A_l\\in\\mathcal B_n\\ (\\text{Birkhoff})",
    desc: "Projects the mixing matrix onto doubly-stochastic matrices (Sinkhorn) for stability at scale. Trades some of HC's expressivity for stability at scale.",
    tags: ["n streams", "Sinkhorn"], depthbench: true
  },
  {
    id: "tbpmhc", name: "TBP-mHC", family: "multistream", year: 2026,
    authors: "Lyubinin", venue: "arXiv 2026",
    arxiv: "2605.21724",
    formula: "A_l \\in \\mathcal T(r, c)\\ \\text{(transportation polytope)}",
    desc: "Relaxes the Birkhoff constraint of mHC to transportation polytopes to recover full expressivity.",
    tags: ["n streams", "mHC family"]
  },
  {
    id: "xhc", name: "xHC", family: "multistream", year: 2026,
    authors: "Zhang, Qin et al.", venue: "arXiv 2026",
    arxiv: "2607.14530",
    formula: "H_l\\in\\mathbb R^{n\\times d},\\ n\\uparrow",
    desc: "Expanded Hyper-Connections: scaling the number / capacity of residual streams.",
    tags: ["n streams", "HC family"]
  },
  {
    id: "ihc", name: "Identity Hyper-Connections (iHC)", family: "multistream", year: 2026,
    authors: "Tencent Hunyuan", venue: "Hy4 preview",
    date: "2026-08",
    link: "https://github.com/Tencent-Hunyuan/Hy4-preview", linkLabel: "Model",
    formula: "H_{l+1} = H_l + \\beta_l(x)\\, F_l\\big(\\alpha_l(x)^{\\top} H_l\\big),\\quad A_l \\equiv I,\\ n=4",
    desc: "The residual design of Tencent's Hy4 preview. It keeps HC's parallel streams and token-dependent sigmoid read (alpha) and write (beta) gates, but fixes stream mixing to the identity, so every stream keeps a clean skip path. (Schematic form.)",
    tags: ["n streams", "HC family", "identity mixing"]
  },
  {
    id: "ohc", name: "oHC", family: "multistream", year: 2026,
    authors: "Guo, Chen et al.", venue: "arXiv 2026",
    arxiv: "2609.02672",
    formula: "A_l \\in SO(4)\\ \\text{via unit quaternions}",
    desc: "Orthogonal Hyper-Connections: constrains stream mixing to rotations in SO(4), parameterised by quaternions, instead of doubly-stochastic matrices.",
    tags: ["n streams", "HC family", "orthogonal"]
  }
];

/* ---------- Reading list: analysis, theory & benchmarks ---------- */
SD.papers = [
  { title: "DepthBench: Measuring How Residual Connections Enable More Computational Depth",
    authors: "Wang et al.", year: 2026, arxiv: "2609.32534",
    topic: "benchmark", note: "Controlled width–depth sweeps across 10 architectures; residual design decides whether depth becomes computation." },
  { title: "The Residual Stream's Effective Depth", authors: "Gahtan, Galil et al.", year: 2026, arxiv: "2609.31098", topic: "analysis" },
  { title: "How Does mHC Use Its Residual Streams? Selective Routing and Near-Identity Mixing", authors: "Zhao, Li et al.", year: 2026, arxiv: "2609.05309", topic: "analysis" },
  { title: "Analyzing Stream Collapse in Hyper-Connections: From Diagnosis to Mitigation", authors: "Alimaskina, Molodtsov et al.", year: 2026, arxiv: "2606.03483", topic: "analysis" },
  { title: "The Birkhoff Geometry of Manifold-Constrained Hyper-Connections", authors: "Li, Sha et al.", year: 2026, arxiv: "2610.06653", topic: "theory" },
  { title: "Accelerating Birkhoff Projection for Manifold-Constrained Hyper-Connections", authors: "Wang, Qiu et al.", year: 2026, arxiv: "2606.07574", topic: "systems" },
  { title: "An Analysis of Residual-Stream Geometry Across Transformer Depth", authors: "Bhattacharya, Kolli et al.", year: 2026, arxiv: "2607.18348", topic: "analysis" },
  { title: "Inverse Depth Scaling From Most Layers Being Similar", authors: "Liu, Kangaslahti, Liu, Gore", year: 2026, arxiv: "2602.05970", topic: "analysis",
    note: "LLM loss falls roughly as 1/depth; similar layers reduce error by ensemble averaging rather than compositional computation." },
  { title: "Do Language Models Use Their Depth Efficiently?", authors: "Csordás, Manning, Potts", year: 2025, arxiv: "2505.13898", topic: "analysis" },
  { title: "The Curse of Depth in Large Language Models", authors: "Sun et al.", year: 2025, arxiv: "2502.05795", topic: "analysis" },
  { title: "Transformer Layers as Painters", authors: "Sun et al.", year: 2024, arxiv: "2407.09298", topic: "analysis" },
  { title: "The Unreasonable Ineffectiveness of the Deeper Layers", authors: "Gromov et al.", year: 2024, arxiv: "2403.17887", topic: "analysis" },
  { title: "Understanding the Difficulty of Training Transformers", authors: "Liu et al.", year: 2020, arxiv: "2004.08249", topic: "theory" },
  { title: "On Layer Normalization in the Transformer Architecture", authors: "Xiong et al.", year: 2020, arxiv: "2002.04745", topic: "theory" },
  { title: "Batch Normalization Biases Residual Blocks Towards the Identity Function in Deep Networks", authors: "De, Smith", year: 2020, arxiv: "2002.10444", topic: "theory" }
];

/* ---------- Tutorials: lectures, courses & long-form guides ---------- */
// `group` is the section heading on the Tutorials page; entries with the same group are listed together.
SD.tutorials = [
  { group: "Learning Resources", type: "Video",
    title: "Stanford CS336 · Lecture 3: Architectures, Hyperparameters",
    source: "Tatsunori Hashimoto · Stanford CS336 Language Modeling from Scratch, Spring 2025",
    link: "https://www.youtube.com/watch?v=ptFiH_bHnJw", linkLabel: "Watch lecture",
    extra: [{ label: "Slides", url: "https://github.com/stanford-cs336/spring2025-lectures/blob/e9cb2488fdb53ea37f0e38924ec3a1701925cef3/nonexecutable/2025%20Lecture%203%20-%20architecture.pdf" },
            { label: "Course", url: "https://cs336.stanford.edu/spring2025/" }],
    desc: "What modern LLMs converged on: pre- vs post-norm, RMSNorm, dropping bias terms, gated activations, and hyperparameters such as the FFN ratio and the width–depth aspect ratio." },
  { group: "Learning Resources", type: "Article",
    title: "The Big LLM Architecture Comparison",
    source: "Sebastian Raschka · Ahead of AI",
    link: "https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison", linkLabel: "Read article",
    desc: "A side-by-side tour of recent open-weight LLM architectures, including where each one places its normalization layers and how deep and wide it is." }
];

/* ---------- Blogs: posts & notes on depth and residual streams ---------- */
// { title, authors, date: "YYYY-MM", link, note?, tag? }
SD.blogs = [
  { title: "Depth Memory", authors: "Philipp Nazari", date: "2026-10",
    link: "https://phnazari.github.io/blog/2026/depth-memory/",
    note: "A walkthrough of Linear Depth Memory: depth mixing as storage and retrieval, the RLS memory, results and the efficient implementation.",
    tag: "LDM" }
];

/* ---------- News ---------- */
SD.news = [
  { date: "2026-10", tag: "Community", title: "ScalingDepth launches",
    text: "A community hub for residual connections and depth scaling — methods, benchmarks and reading lists. Contributions welcome." }
];

/* ---------- Links ---------- */
SD.links = {
  repo: "https://github.com/keyu-wang-2002/ScalingDepth",
  paper: "https://arxiv.org/abs/2609.32534",
  code: "https://github.com/keyu-wang-2002/DepthBench",
  hf: "https://huggingface.co/aspect-ratio-scaling"
};
