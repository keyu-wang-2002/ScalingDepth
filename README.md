<div align="center">

<img src="assets/img/logo.svg" width="72" alt="ScalingDepth logo">

# ScalingDepth

**A community collection of residual connections, normalization and depth scaling for deep networks.**

[🌐 Website](https://keyu-wang-2002.github.io/ScalingDepth/) ·
[📚 Residuals](https://keyu-wang-2002.github.io/ScalingDepth/pages/methods.html) ·
[⚖️ Benchmarks](https://keyu-wang-2002.github.io/ScalingDepth/pages/benchmarks.html)

</div>

---

Depth is a scaling axis, but only if your residual connections let it be.
ScalingDepth collects residual connection designs, from ResNet's identity shortcut to
Hyper-Connections and Attention Residuals, along with the benchmarks and analysis of whether extra layers
become extra computation.

## What's inside

| Page | Content |
|---|---|
| **Residuals** | Searchable collection of 55+ residual, normalization and depth-parametrization designs in 5 families, each with a one-line update rule |
| **Benchmarks** | Controlled evaluations of whether added depth becomes computation (e.g. DepthBench) |
| **Papers** | Reading list of analysis, theory and systems papers on effective depth |
| **Tutorials** | Lectures and long-form guides on Transformer architectures, normalization and depth |
| **Blogs** | Blog posts and notes on residual connections and depth |
| **Community** | How to contribute, roadmap, maintainers |

### Families

- **Classic Shortcuts**: Highway, ResNet, Stochastic Depth, DenseNet
- **Normalization Placement**: Post-LN, Pre-LN, Sandwich-LN, ResiDual, Mix-LN, Peri-LN, HybridNorm, DyT, LNS, nGPT, KEEL, GeoNorm, SiameseNorm, KiteNorm
- **Residual Scaling & Parametrization**: Fixup, ReZero, SkipInit, Admin, LayerScale, DeepNorm, Depth-µP, 1/√L scaling, CompleteP
- **Cross-Layer Aggregation**: RealFormer, DenseFormer, Value Residual, RWKV-7 Value Residual, LAuReL, DCA, MUDDFormer, AttnRes (Full / Block / variants), MoDA
- **Multi-Stream / Hyper-Connections**: HC, mHC, TBP-mHC, xHC, oHC

## Contributing

All content lives in a single file: [`assets/js/data.js`](assets/js/data.js).
To add a method or paper, append an entry and open a PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step. The site is plain HTML/CSS/JS, served by GitHub Pages from the repo root.

## Citation

If you use the benchmark results, please cite:

```bibtex
@article{wang2026depthbench,
  title   = {DepthBench: Measuring How Residual Connections Enable More Computational Depth},
  author  = {Wang, Keyu and Huang, Yangyi and Kang, Jiale and Gonz{\'a}lez-Mart{\'i}nez, David and Liu, Weiyang and Liu, Shiwei},
  journal = {arXiv preprint arXiv:2609.32534},
  year    = {2026}
}
```

## License

MIT
