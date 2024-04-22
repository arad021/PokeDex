import {Component, OnInit} from '@angular/core';
import {Pokemon, PokemonList} from "../pokemon-api-type";
import {HttpClient} from "@angular/common/http";
import {HeaderComponent} from "../header/header.component";
import {RouterLink} from "@angular/router";
import {BehaviorSubject, combineLatest, debounceTime, fromEvent, map, Observable, scan, switchMap, tap} from "rxjs";
import {PokemonServiceService} from "../Services/pokemon-service.service";
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {

  private readonly limit = 20;

  private offsetSubject = new BehaviorSubject<number>(0);
  public offset$ = this.offsetSubject.asObservable();
  pokemons$!: Observable<Array<Pokemon>>;

  public getPokemonList$(offset: number) {
    return this.httpClient.get<PokemonList>(`https://pokeapi.co/api/v2/pokemon`, {
      params: {
        limit: this.limit,
        offset: offset
      }
    })
  }

  constructor(
    private httpClient: HttpClient, private pokemonService: PokemonServiceService
  ) {

  }

  ngOnInit() {

    fromEvent(document, 'scroll').pipe(
      debounceTime(500),
      map(scrollEvent => {
        console.log(window.scrollY , window.document.body.scrollHeight)
        console.log(window.scrollY / window.document.body.scrollHeight)
        return ((window.scrollY + window.innerHeight) / window.document.body.scrollHeight) >= 0.8;
      }),
      tap(console.log),
    ).subscribe(shoudLoadMore => {
      if (shoudLoadMore) {
        this.morePokemons()
      }
    });


    this.pokemons$ = this.offset$.pipe(
      switchMap(offset => this.getPokemonList$(offset)),
      map(pokemonList => pokemonList.results.map(result => result.name)),
      switchMap(pokemonNames => {
        const requestsForAllPokemons$ = pokemonNames.map(name => this.pokemonService.getPokemon$(name));
        return combineLatest(requestsForAllPokemons$);
      }),
      scan((acc, curr) => [...acc, ...curr]),
    )

  }

  morePokemons() {
    this.offsetSubject.next(this.offsetSubject.getValue() + this.limit);
  }
}


// offset: 0, limit: 10
// more
// offset: 10, limit: 10
// more
// offset: 20, limit: 10

