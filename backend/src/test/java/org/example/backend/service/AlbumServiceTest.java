package org.example.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.example.backend.dto.AlbumRequest;
import org.example.backend.dto.AlbumResponse;
import org.example.backend.exception.ConflictException;
import org.example.backend.exception.ResourceNotFoundException;
import org.example.backend.model.Album;
import org.example.backend.model.Artista;
import org.example.backend.model.FilaReproducao;
import org.example.backend.model.Musica;
import org.example.backend.model.Playlist;
import org.example.backend.repository.AlbumRepository;
import org.example.backend.repository.ArtistaRepository;
import org.example.backend.repository.CurtidaRepository;
import org.example.backend.repository.FilaReproducaoRepository;
import org.example.backend.repository.HistoricoReproducaoRepository;
import org.example.backend.repository.MusicaRepository;
import org.example.backend.repository.PlaylistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AlbumServiceTest {
	
	@Mock
	private AlbumRepository albumRepository;
	
	@Mock
	private ArtistaRepository artistaRepository;
	
	@Mock
	private MusicaRepository musicaRepository;
	
	@Mock
	private PlaylistRepository playlistRepository;
	
	@Mock
	private HistoricoReproducaoRepository historicoRepository;
	
	@Mock
	private FilaReproducaoRepository filaRepository;
	
	@Mock
	private CurtidaRepository curtidaRepository;
	
	@InjectMocks
	private AlbumService albumService;
	
	private Artista artista;
	private Album album;
	private AlbumRequest request;
	
	@BeforeEach
	void setUp() {
		artista = new Artista();
		artista.setId(1L);
		artista.setNome("Artista Teste");
		
		album = new Album("Titulo Teste", "http://capa.com/img.png", 2020, artista);
		album.setId(10L);
		
		request = new AlbumRequest("Titulo Teste", 1L, "http://capa.com/img.png", 2020);
	}
	
	// ---------- listAll ----------
	
	@Test
	void listAll_deveRetornarListaDeAlbumResponses() {
		when(albumRepository.findAll()).thenReturn(List.of(album));
		
		List<AlbumResponse> result = albumService.listAll();
		
		assertThat(result).hasSize(1);
		assertThat(result.get(0).titulo()).isEqualTo("Titulo Teste");
		verify(albumRepository, times(1)).findAll();
	}
	
	@Test
	void listAll_deveRetornarListaVaziaQuandoNaoHaAlbuns() {
		when(albumRepository.findAll()).thenReturn(List.of());
		
		List<AlbumResponse> result = albumService.listAll();
		
		assertThat(result).isEmpty();
	}
	
	// ---------- getById ----------
	
	@Test
	void getById_deveRetornarAlbumResponseQuandoExistir() {
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		
		AlbumResponse response = albumService.getById(10L);
		
		assertThat(response).isNotNull();
		assertThat(response.titulo()).isEqualTo("Titulo Teste");
	}
	
	@Test
	void getById_deveLancarExcecaoQuandoNaoEncontrado() {
		when(albumRepository.findById(99L)).thenReturn(Optional.empty());
		
		assertThatThrownBy(() -> albumService.getById(99L))
				.isInstanceOf(ResourceNotFoundException.class)
				.hasMessageContaining("99");
	}
	
	// ---------- create ----------
	
	@Test
	void create_deveCriarAlbumComSucesso() {
		when(artistaRepository.findById(1L)).thenReturn(Optional.of(artista));
		when(albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista))
				.thenReturn(Optional.empty());
		when(albumRepository.save(any(Album.class))).thenReturn(album);
		
		AlbumResponse response = albumService.create(request);
		
		assertThat(response).isNotNull();
		assertThat(response.titulo()).isEqualTo("Titulo Teste");
		verify(albumRepository, times(1)).save(any(Album.class));
	}
	
	@Test
	void create_deveLancarExcecaoQuandoArtistaNaoEncontrado() {
		when(artistaRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThatThrownBy(() -> albumService.create(request))
				.isInstanceOf(ResourceNotFoundException.class);
		
		verify(albumRepository, never()).save(any(Album.class));
	}
	
	@Test
	void create_deveLancarExcecaoQuandoAlbumJaExisteParaArtista() {
		when(artistaRepository.findById(1L)).thenReturn(Optional.of(artista));
		when(albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista))
				.thenReturn(Optional.of(album));
		
		assertThatThrownBy(() -> albumService.create(request))
				.isInstanceOf(ConflictException.class);
		
		verify(albumRepository, never()).save(any(Album.class));
	}
	
	// ---------- update ----------
	
	@Test
	void update_deveAtualizarAlbumComSucesso() {
		AlbumRequest updateRequest = new AlbumRequest("Novo Titulo", 1L, "http://nova-capa.com/img.png", 2021);
		
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(artistaRepository.findById(1L)).thenReturn(Optional.of(artista));
		when(albumRepository.findByTituloIgnoreCaseAndArtista(updateRequest.titulo(), artista))
				.thenReturn(Optional.empty());
		when(albumRepository.save(any(Album.class))).thenReturn(album);
		
		AlbumResponse response = albumService.update(10L, updateRequest);
		
		assertThat(response).isNotNull();
		verify(albumRepository, times(1)).save(album);
	}
	
	@Test
	void update_deveLancarExcecaoQuandoAlbumNaoEncontrado() {
		when(albumRepository.findById(99L)).thenReturn(Optional.empty());
		
		assertThatThrownBy(() -> albumService.update(99L, request))
				.isInstanceOf(ResourceNotFoundException.class);
		
		verify(albumRepository, never()).save(any(Album.class));
	}
	
	@Test
	void update_deveLancarExcecaoQuandoArtistaNaoEncontrado() {
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(artistaRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThatThrownBy(() -> albumService.update(10L, request))
				.isInstanceOf(ResourceNotFoundException.class);
		
		verify(albumRepository, never()).save(any(Album.class));
	}
	
	@Test
	void update_deveLancarExcecaoQuandoTituloJaExisteParaOutroAlbum() {
		Album outroAlbum = new Album("Titulo Teste", "http://capa.com/img.png", 2020, artista);
		outroAlbum.setId(20L);
		
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(artistaRepository.findById(1L)).thenReturn(Optional.of(artista));
		when(albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista))
				.thenReturn(Optional.of(outroAlbum));
		
		assertThatThrownBy(() -> albumService.update(10L, request))
				.isInstanceOf(ConflictException.class);
		
		verify(albumRepository, never()).save(any(Album.class));
	}
	
	@Test
	void update_naoDeveLancarExcecaoQuandoTituloExistenteForDoProprioAlbum() {
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(artistaRepository.findById(1L)).thenReturn(Optional.of(artista));
		when(albumRepository.findByTituloIgnoreCaseAndArtista(request.titulo(), artista))
				.thenReturn(Optional.of(album));
		when(albumRepository.save(any(Album.class))).thenReturn(album);
		
		AlbumResponse response = albumService.update(10L, request);
		
		assertThat(response).isNotNull();
		verify(albumRepository, times(1)).save(album);
	}
	
	// ---------- delete ----------
	
	@Test
	void delete_deveDeletarAlbumComSucessoQuandoNaoHaMusicas() {
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(musicaRepository.findAllByAlbum_Id(10L)).thenReturn(List.of());
		
		albumService.delete(10L);
		
		verify(albumRepository, times(1)).delete(album);
		verify(musicaRepository, times(1)).deleteAll(List.of());
	}
	
	@Test
	void delete_deveLancarExcecaoQuandoAlbumNaoEncontrado() {
		when(albumRepository.findById(99L)).thenReturn(Optional.empty());
		
		assertThatThrownBy(() -> albumService.delete(99L))
				.isInstanceOf(ResourceNotFoundException.class);
		
		verify(albumRepository, never()).delete(any(Album.class));
	}
	
	@Test
	void delete_deveRemoverMusicasDeListasEHistoricoAntesDeDeletarAlbum() {
		Musica musica = new Musica();
		musica.setId(100L);
		
		Playlist playlist = new Playlist();
		FilaReproducao fila = new FilaReproducao();
		
		when(albumRepository.findById(10L)).thenReturn(Optional.of(album));
		when(musicaRepository.findAllByAlbum_Id(10L)).thenReturn(List.of(musica));
		when(playlistRepository.findAllByMusicas_Id(100L)).thenReturn(List.of(playlist));
		when(filaRepository.findAllByFilaMusicas_Musica_Id(100L)).thenReturn(List.of(fila));
		
		albumService.delete(10L);
		
		verify(playlistRepository, times(1)).saveAll(List.of(playlist));
		verify(filaRepository, times(1)).saveAll(List.of(fila));
		verify(historicoRepository, times(1)).deleteByMusica(musica);
		verify(curtidaRepository, times(1)).deleteByMusica(musica);
		verify(musicaRepository, times(1)).deleteAll(List.of(musica));
		verify(albumRepository, times(1)).delete(album);
	}
}