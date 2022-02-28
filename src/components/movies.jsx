import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import ListGroup from "../common/listGroup";
import MoviesTable from "./moviesTable";
import Pagination from "../common/pagination";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/fakeGenreService";
import _ from "lodash";
import "../styles/table.css";

class Movies extends Component {
    state = {
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        sortColumn: { path: 'title', order: 'asc' }
    };

    componentDidMount() {
        const genres = [{ _id: "", name: 'All Genres' }, ...getGenres()]
        this.setState({ movies: getMovies(), genres })
    }

    deleteMovie = id => {
        const movies = this.state.movies.filter(m => m._id !== id);
        this.setState({ movies })
    };

    onLikeChanged = movie => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] }
        movies[index].liked = !movies[index].liked;
        this.setState({ movies })
    };
    handlePageChange = page => {
        this.setState({ currentPage: page })
    };
    handleGenreSelect = genre => {
        this.setState({ selectedGenre: genre, currentPage: 1 })
    };
    handleSort = sortColumn => {
        this.setState({ sortColumn })
    }
    getPagedData() {
        const {
            pageSize,
            sortColumn,
            currentPage,
            selectedGenre,
            movies: allMovies
        } = this.state;
        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const movies = paginate(sorted, currentPage, pageSize)
        return { totalCount: filtered.length, data: movies }
    }
    render() {
        const { length: count } = this.state.movies;
        const {
            pageSize,
            sortColumn,
            currentPage,
        } = this.state;

        const { totalCount, data: movies } = this.getPagedData();

        return (
            <div className="row">
                <div className="col-3">
                    <ListGroup
                        items={this.state.genres}
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect}
                    />
                </div>
                <div className="col">
                    {count === 0 ? (<p>There are not movies in data-base</p>) :
                        (<p>showing {totalCount} movies in the data-base</p>)}
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onLike={this.onLikeChanged}
                        onDelete={this.deleteMovie}
                        onSort={this.handleSort} />
                    <Pagination
                        itemsCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange} />
                </div>
            </div>
        );
    }
}

export default Movies;
