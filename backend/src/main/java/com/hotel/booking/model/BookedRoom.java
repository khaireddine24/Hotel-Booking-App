package com.hotel.booking.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookedRoom {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long bookingId;
	
	@Column(name="check_In")
	private LocalDate checkInDate;
	
	@Column(name="check_Out")
	private LocalDate checkOutDate;
	
	@Column(name="guest_FullName")
	private String guestFullName;
	
	@Column(name="guest_Email")
	private String guestEmail;
	
	@Column(name="adults")
	private int NumAdults;
	
	@Column(name="children")
	private int NumChildren;
	
	@Column(name="total_guest")
	private int totalNumGuest;
	
	@Column(name="confirmation_Code")
	private String bookingConfirmationCode;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="room_id")
	private Room room;
	
	public BookedRoom(String bookingConfirmationCode) {
		this.bookingConfirmationCode = bookingConfirmationCode;
	}
	
	public void calculateNumbersGuest() {
		this.totalNumGuest=this.NumAdults+NumChildren;
	}
	
	public int getNumAdults() {
		return NumAdults;
	}

	public void setNumAdults(int numAdults) {
		NumAdults = numAdults;
		calculateNumbersGuest();
	}

	public int getNumChildren() {
		return NumChildren;
	}

	public void setNumChildren(int numChildren) {
		NumChildren = numChildren;
		calculateNumbersGuest();
	}

}
