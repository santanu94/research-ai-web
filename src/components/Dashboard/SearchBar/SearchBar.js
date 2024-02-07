import React, { useState } from "react";
import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";
import { arxiv_search } from "../../../utils/arxiv";

const SearchBar = ({ setSearchResults, additionalClassName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [isFetchingPapers, setIsFetchingPapers] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = async () => {
    try {
      setIsFetchingPapers(true);
      const results = await arxiv_search({ [searchField]: searchTerm });
      // const results = [
      //   {
      //     title: "A harmonic level set proof of a positive mass theorem",
      //     link: "http://arxiv.org/abs/2306.09097v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  We provide a harmonic level set proof of the positive mass theorem for\nasymptotically flat $3$-manifolds with a non-compact boundary first established\nby Almaraz-Barbosa-de Lima.\n",
      //   },
      //   {
      //     title: "2-Adic Stratification of Totients",
      //     link: "http://arxiv.org/abs/2005.05475v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  In this paper we study the multiplicities and the asymptotic behaviour of the\nnumbers of totients in the strata given by 2-adic valuation.\n",
      //   },
      //   {
      //     title: "SUSY QM via 2x2 Matrix Superpotential",
      //     link: "http://arxiv.org/abs/hep-th/0308189v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  The N=2 supersymmetry in quantum mechanics involving two-component\neigenfunction is investigated.\n",
      //   },
      //   {
      //     title:
      //       "Indecomposability of branched coverings of even degree on the projective\n  plane",
      //     link: "http://arxiv.org/abs/1005.0606v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  In this work we characterize branch data of branched coverings of even degree\nover the projective plane which are realizable by indecomposable branched\ncoverings.\n",
      //   },
      //   {
      //     title: "A nice limaçon-like spiral",
      //     link: "http://arxiv.org/abs/1309.5592v2",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  A lima\\c{c}on-like curve, allowing 2{\\pi}-transition with monotone curvature\nbetween concentric curvature elements, is presented. The curve is 4th degree\nalgebraic, 4th degree rational, and shares other common features with Pascal's\nlima\\c{c}on.\n",
      //   },
      //   {
      //     title:
      //       "On the Scalar Potential Models from the Isospectral Potential Class",
      //     link: "http://arxiv.org/abs/hep-th/0204175v2",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  Static field classical configurations in (1+1)-dimensions for new non-linear\npotential models are investigated from an isospectral potential class and the\nconcept of bosonic zero- mode solution. One of the models here considered has a\nstatic non-topological configuration with a single vacuum state that breaks\nsupersymmetry.\n",
      //   },
      //   {
      //     title: "q-Deformed Kink Solutions",
      //     link: "http://arxiv.org/abs/hep-th/0301114v4",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  The q-deformed kink of the $\\lambda\\phi^4-$model is obtained via the\nnormalisable ground state eigenfunction of a fluctuation operator associated\nwith the q-deformed hyperbolic functions. From such a bosonic zero-mode the\nq-deformed potential in 1+1 dimensions is found, and we show that the\nq-deformed kink solution is a kink displaced away from the origin.\n",
      //   },
      //   {
      //     title: "Inhomogeneus Inflation and Cosmic no-Hair Conjecture",
      //     link: "http://arxiv.org/abs/0903.3449v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       '  The cosmic no hair conjecture is tested for a large class of inhomogeneous\ncosmologies with a positive cosmological constant. Firstly, we derive a new\nclass of exact inhomogeneous cosmological solutions whose matter content of the\nmodels is formed by a mixture of two interacting simple fluids plus a\ncosmological Lambda-term. These models generalize the de Sitter spacetime and\nthe inhomogeneous two-fluid Szekeres-type cosmologies derived by Lima and\nTiomno. Finally, we show that the late time behaviour of our solutions is in\nagreement with the "cosmic no hair theorem" of Hawking and Moss.\n',
      //   },
      //   {
      //     title: "Origin and residence time of water in the Lima Aquifer",
      //     link: "http://arxiv.org/abs/1403.4974v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  The 8 million inhabitants of the coast Lima City are supplied with water from\nRimac and Chillons rivers and water wells in the Lima aquifer. Historics of\nRimac River flow and static level of water level in wells are correlated in\norder to calculate residence time of water since the aquifer is recharged by\nRimac River until water reaches a well located 12 km farther, in Miraflores\ndistrict near sea. Relative abundances of 2H and 18O are used to identify\norigins of waters from those wells. 3H and 14C contents, respectively, are used\nto estimate ages of waters.\n",
      //   },
      //   {
      //     title:
      //       "Symbolic dynamics for large non-uniformly hyperbolic sets of three\n  dimensional flows",
      //     link: "http://arxiv.org/abs/2307.14319v1",
      //     authors: [
      //       "\n      Rondinelle Batista\n    ",
      //       "\n      Levi Lopes de Lima\n    ",
      //     ],
      //     date: "2023-06-15T12:49:12Z",
      //     summary:
      //       "  We construct symbolic dynamics for three dimensional flows with positive\nspeed. More precisely, for each $\\chi>0$, we code a set of full measure for\nevery invariant probability measure which is $\\chi$-hyperbolic. These include\nall ergodic measures with entropy bigger than $\\chi$ as well as all hyperbolic\nperiodic orbits of saddle-type with Lyapunov exponent outside of\n$[-\\chi,\\chi]$. This contrasts with a previous work of Lima & Sarig which built\na coding associated to a given invariant probability measure. As an\napplication, we code homoclinic classes of measures by suspensions of\nirreducible countable Markov shifts.\n",
      //   },
      // ];
      setSearchResults(results);
      // console.log(results);
    } catch (error) {
      console.error("Search error:", error); // Handle search error
    } finally {
      setIsFetchingPapers(false);
    }
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className={`search-bar-container ${additionalClassName}`}>
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="search-field-selector text-center"
      >
        <option value="author">Author</option>
        <option value="title">Title</option>
        <option value="abstrct">Abstract</option>
        <option value="all">All</option>
      </select>
      <input
        className="search-bar"
        type="text"
        placeholder="Search research papers, authors or conferences"
        onChange={handleSearchChange}
        onKeyPress={handleSearchKeyPress}
        value={searchTerm}
      />
      <div
        className="search-icon d-flex align-items-center flex-shrink-1"
        onClick={performSearch}
      >
        {isFetchingPapers ? (
          <div className="spinner spinner-grow" role="status"></div>
        ) : (
          <IoSearch />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
